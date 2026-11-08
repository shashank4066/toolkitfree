import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cropper, { type Area } from 'react-easy-crop';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import type { Tool } from '../../config/tools';
import { UploadZone } from '../../components/UploadZone';
import { FileList } from '../../components/FileList';
import { Results, Progress } from '../../components/ResultCard';
import { Button } from '../../components/ui/button';
import { Field, NumberField, SelectField, RangeField, Checkbox } from '../../components/Fields';
import { useObjectUrl, useTask } from '../../lib/hooks';
import { imageJob } from '../../lib/worker';
import { imageAccept, prepareImage, detectFormat, imageDimensions, type ImageOptions } from '../../lib/image';
import { baseName, type OutputFile } from '../../lib/utils';
const presets:[string,number,number][]=[['Instagram post',1080,1080],['Instagram story',1080,1920],['YouTube thumbnail',1280,720],['LinkedIn banner',1584,396],['WhatsApp DP',640,640],['Passport · 300 DPI',413,531]];
type ImageResult={blob:Blob;width:number;height:number;met:boolean};
export default function ImageTools({tool}:{tool:Tool}) {
  const [searchParams] = useSearchParams();
  const slug=tool.slug,isResize=['image-resizer','image-dimensions-size'].includes(slug),isCrop=slug==='image-crop',isCompress=['image-compressor','image-target-size','image-dimensions-size'].includes(slug);
  const paramTarget = Number(searchParams.get('target') || searchParams.get('kb') || searchParams.get('mb') || searchParams.get('size'));
  const paramUnit = (searchParams.get('unit') || (searchParams.get('mb') ? 'MB' : 'KB')).toUpperCase() === 'MB' ? 'MB' : 'KB';
  const paramWidth = Number(searchParams.get('width') || searchParams.get('w'));
  const paramHeight = Number(searchParams.get('height') || searchParams.get('h'));
  const paramUnits = searchParams.get('units') || 'px';
  const paramFormat = searchParams.get('format');
  const firstImage = useRef(true);

  const [files,setFiles]=useState<File[]>([]),[outputs,setOutputs]=useState<OutputFile[]>([]),[preview,setPreview]=useState<Blob>(),[original,setOriginal]=useState({width:0,height:0});
  const [quality,setQuality]=useState(85),[format,setFormat]=useState(
    paramFormat && ['jpg', 'png', 'webp', ...(slug === 'image-converter' ? ['avif'] : [])].includes(paramFormat)
      ? paramFormat
      : 'jpg',
  );
  const [targetOn,setTargetOn]=useState(paramTarget > 0 || (slug!=='image-compressor'&&slug!=='image-dimensions-size'));
  const [target,setTarget]=useState(paramTarget > 0 ? paramTarget : 100);
  const [sizeUnit,setSizeUnit]=useState(paramUnit);
  const [width,setWidth]=useState(paramWidth > 0 ? paramWidth : 1200);
  const [height,setHeight]=useState(paramHeight > 0 ? paramHeight : 800);
  const [units,setUnits]=useState(['px','cm','percent'].includes(paramUnits) ? paramUnits : 'px');
  const [dpi,setDpi]=useState(300),[percent,setPercent]=useState(50),[locked,setLocked]=useState(true),[rotation,setRotation]=useState(0),[flipX,setFlipX]=useState(false),[flipY,setFlipY]=useState(false);
  const [crop,setCrop]=useState({x:0,y:0}),[zoom,setZoom]=useState(1),[aspect,setAspect]=useState('1'),[cropArea,setCropArea]=useState<Area>(),[freeCrop,setFreeCrop]=useState({x:0,y:0,width:100,height:100});
  const task=useTask(),url=useObjectUrl(preview),afterUrl=useObjectUrl(outputs[0]?.blob);
  const file = files[0];
  useEffect(() => {
    let active = true;
    setPreview(undefined);
    if (!file) {
      firstImage.current = true;
      return;
    }

    async function loadPreview(source: File) {
      try {
        const blob = await prepareImage(source);
        const dimensions = await imageDimensions(blob);
        if (!active) return;

        setOriginal(dimensions);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        if (firstImage.current) {
          firstImage.current = false;
          if (paramUnits === 'cm') {
            setWidth(paramWidth > 0 ? paramWidth : 3.5);
            setHeight(paramHeight > 0 ? paramHeight : 4.5);
            setLocked(false);
          } else {
            const ratio = dimensions.width / dimensions.height;
            setWidth(paramWidth > 0 ? paramWidth : paramHeight > 0 ? Math.round(paramHeight * ratio) : dimensions.width);
            setHeight(paramHeight > 0 ? paramHeight : paramWidth > 0 ? Math.round(paramWidth / ratio) : dimensions.height);
            setLocked(!(paramWidth > 0 && paramHeight > 0));
          }
          if (!paramFormat && (isResize || isCrop || slug === 'image-remove-metadata' || slug === 'image-rotate')) {
            setFormat(detectFormat(source));
          }
        }
        setPreview(blob);
      } catch (error) {
        if (active) task.setError(error instanceof Error ? error.message : 'This image could not be opened.');
      }
    }

    void loadPreview(file);
    return () => { active = false; };
  }, [file, isCrop, isResize, paramFormat, paramHeight, paramUnits, paramWidth, slug]);
  function addFiles(next:File[]){if(files.length+next.length>20){task.setError('Choose up to 20 images per batch. Start another batch when you are done.');return;}setFiles(isCrop?[next[0]]:[...files,...next]);task.setError('');setOutputs([]);}
  function changeWidth(value:number){setWidth(value);if(locked&&original.width)setHeight(Number((value*original.height/original.width).toFixed(units==='cm'?2:0)));}
  function changeHeight(value:number){setHeight(value);if(locked&&original.height)setWidth(Number((value*original.width/original.height).toFixed(units==='cm'?2:0)));}
  async function process(){
    if(!files.length)return;
    if(isResize&&units!=='percent'&&(!(width>0)||!(height>0)||!Number.isFinite(width+height))){task.setError('Enter a width and height greater than zero.');return;}
    if(isCompress&&targetOn&&(!(target>0)||!Number.isFinite(target))){task.setError('Enter a target file size greater than zero.');return;}
    if(units==='cm'&&(!(dpi>0)||!Number.isFinite(dpi))){task.setError('Enter a DPI greater than zero.');return;}
    setOutputs([]);
    const results=await task.run(async(report,signal)=>{const list:OutputFile[]=[];
      for(let i=0;i<files.length;i++){
        signal.throwIfAborted();const file=files[i],blob=await prepareImage(file),dims=await imageDimensions(blob);
        let w=0,h=0;if(isResize){if(units==='percent'){if(percent<=0||percent>1000)throw new Error('Choose a percentage between 1 and 1000.');w=dims.width*percent/100;h=dims.height*percent/100;}else if(units==='cm'){w=width/2.54*dpi;h=height/2.54*dpi;}else{w=width;h=height;}}
        const cropData=isCrop?(aspect==='free'?{x:freeCrop.x/100*dims.width,y:freeCrop.y/100*dims.height,width:Math.min(freeCrop.width,100-freeCrop.x)/100*dims.width,height:Math.min(freeCrop.height,100-freeCrop.y)/100*dims.height}:cropArea):undefined;
        if(isCrop&&(!cropData||cropData.width<=0||cropData.height<=0))throw new Error('Choose a crop area first.');
        const options:ImageOptions={mode:slug,format,quality,target:isCompress&&targetOn?target*(sizeUnit==='MB'?1000000:1000):0,width:w,height:h,keepDimensions:slug==='image-dimensions-size',rotation:slug==='image-rotate'?rotation:0,flipX:slug==='image-rotate'&&flipX,flipY:slug==='image-rotate'&&flipY,crop:cropData};
        const result=await imageJob<ImageResult>({blob,options},(n,message)=>report((i+n/100)/files.length*100,'Image '+(i+1)+' of '+files.length+' · '+message),signal);
        list.push({name:baseName(file.name)+'-'+slug.replace('image-','')+'.'+format,blob:result.blob,originalSize:file.size,preview:true,note:result.width+' × '+result.height+' px'+(!result.met?' · Target not reached. This is the smallest output found at the permitted dimensions. Try a larger target or smaller dimensions.':options.target?' · Within your size target.':'')});report((i+1)/files.length*100,'Finished image '+(i+1));
      }return list;
    });if(results)setOutputs(results);
  }
  return <><div className={files.length?'workspace-split':''}><div><UploadZone accept={imageAccept} label="JPG, PNG, WebP, AVIF or HEIC" multiple={!isCrop} maxFiles={isCrop?1:20} onFiles={addFiles} compact={files.length>0} disabled={task.busy}/>
    {!!files.length&&<FileList files={files} onChange={next=>{setFiles(next);setOutputs([]);}} disabled={task.busy}/>}
    {url&&isCrop&&aspect!=='free'&&<div className="crop-preview"><Cropper image={url} crop={crop} zoom={zoom} aspect={Number(aspect)} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_,pixels)=>setCropArea(pixels)}/></div>}
    {url&&isCrop&&aspect==='free'&&<><img className="image-preview" src={url} alt="Image to crop"/><p className="help-text">Set any crop rectangle using the position and dimensions controls. Values are percentages of the original image.</p></>}
    {url&&!isCrop&&!outputs.length&&<img className="image-preview" src={url} alt="Original image preview" style={slug==='image-rotate'?{transform:'none'}:undefined}/>}
    {url&&afterUrl&&<div className="before-after"><figure><img src={url} alt="Before processing"/><figcaption>Before · {original.width} × {original.height}</figcaption></figure><figure><img src={afterUrl} alt="After processing"/><figcaption>After · preview</figcaption></figure></div>}
    </div>{files.length>0&&<div className="options-panel"><h3><SlidersHorizontal size={16}/>Image settings</h3>{!preview && !task.error && <p className="help-text" role="status">Reading image…</p>}<fieldset disabled={task.busy || !preview} style={{border:0,padding:0,margin:0}}>
    <SelectField label="Output format" value={format} onChange={e=>setFormat(e.target.value)} options={[['jpg','JPG'],['png','PNG · lossless'],['webp','WebP'],...(slug==='image-converter'?[['avif','AVIF · if browser supports encoding'] as [string,string]]:[])]}/>
    {format!=='png'&&<RangeField label="Quality (%)" min={5} max={100} value={quality} onChange={e=>setQuality(Number(e.target.value))}/>}
    {isCompress && <>
      {slug !== 'image-target-size' && (
        <Checkbox label="Use a file size target" checked={targetOn} onChange={e => setTargetOn(e.target.checked)} />
      )}
      <div className="field-row">
        <NumberField label="Target file size" min={.001} step="any" disabled={!targetOn} value={target} onChange={e => setTarget(Number(e.target.value))} />
        <SelectField label="Unit" disabled={!targetOn} value={sizeUnit} onChange={e => setSizeUnit(e.target.value)} options={['KB', 'MB']} />
      </div>
      <div className="chip-group">
        {[10, 20, 50, 100, 200, 500, 1000].map(size => {
          const selected = targetOn && target * (sizeUnit === 'MB' ? 1000 : 1) === size;
          return (
            <button
              type="button"
              key={size}
              className={selected ? 'chip active' : 'chip'}
              aria-pressed={selected}
              onClick={() => {
                setTargetOn(true);
                setTarget(size === 1000 ? 1 : size);
                setSizeUnit(size === 1000 ? 'MB' : 'KB');
              }}
            >
              {size === 1000 ? '1 MB' : size + ' KB'}
            </button>
          );
        })}
      </div>
      <p className="help-text" style={{ marginBottom: 16 }}>
        {slug === 'image-dimensions-size' ? 'The output keeps your chosen dimensions.' : 'The tool may reduce dimensions to reach the target.'}
      </p>
    </>}
    {isResize&&<><SelectField label="Resize by" value={units} onChange={e=>{setUnits(e.target.value);if(e.target.value==='cm'){setWidth(3.5);setHeight(4.5);setLocked(false);}else if(e.target.value==='px'){setWidth(original.width);setHeight(original.height);}}} options={[['px','Pixels'],['percent','Percentage'],['cm','Centimeters & DPI']]}/>
      {units==='percent'?<NumberField label="Scale (%)" min={1} max={1000} value={percent} onChange={e=>setPercent(Number(e.target.value))}/>:<><div className="field-row"><NumberField label={'Width ('+units+')'} min={.01} step="any" value={width} onChange={e=>changeWidth(Number(e.target.value))}/><NumberField label={'Height ('+units+')'} min={.01} step="any" value={height} onChange={e=>changeHeight(Number(e.target.value))}/></div><Checkbox label="Lock aspect ratio" checked={locked} onChange={e=>setLocked(e.target.checked)}/></>}
      {units==='cm'&&<NumberField label="DPI for pixel calculation" min={1} max={1200} value={dpi} onChange={e=>setDpi(Number(e.target.value))} help={'Output: '+Math.round(width/2.54*dpi)+' × '+Math.round(height/2.54*dpi)+' pixels. DPI calculates pixels; print settings control physical size.'}/>}
      <SelectField label="Quick presets" value="" onChange={e=>{const preset=presets[Number(e.target.value)];setUnits('px');setWidth(preset[1]);setHeight(preset[2]);setLocked(false);}} options={[['','Choose a preset…'],...presets.map((p,i)=>[String(i),p[0]] as [string,string])]}/></>}
    {isCrop&&<><SelectField label="Crop ratio" value={aspect} onChange={e=>setAspect(e.target.value)} options={[['1','Square · 1:1'],[String(4/3),'4:3'],[String(16/9),'16:9'],['free','Free crop rectangle']]}/>{aspect==='free'?<><div className="field-row"><NumberField label="Left (%)" min={0} max={99} value={freeCrop.x} onChange={e=>setFreeCrop({...freeCrop,x:Math.min(99,Math.max(0,Number(e.target.value)))})}/><NumberField label="Top (%)" min={0} max={99} value={freeCrop.y} onChange={e=>setFreeCrop({...freeCrop,y:Math.min(99,Math.max(0,Number(e.target.value)))})}/></div><div className="field-row"><NumberField label="Width (%)" min={1} max={100} value={freeCrop.width} onChange={e=>setFreeCrop({...freeCrop,width:Number(e.target.value)})}/><NumberField label="Height (%)" min={1} max={100} value={freeCrop.height} onChange={e=>setFreeCrop({...freeCrop,height:Number(e.target.value)})}/></div></>:<RangeField label="Zoom" min={1} max={3} step={.01} value={zoom} onChange={e=>setZoom(Number(e.target.value))}/>}</>}
    {slug==='image-rotate'&&<><SelectField label="Rotation" value={rotation} onChange={e=>setRotation(Number(e.target.value))} options={[['0','No rotation'],['90','90° clockwise'],['180','180°'],['270','90° counterclockwise']]}/><Checkbox label="Flip horizontally" checked={flipX} onChange={e=>setFlipX(e.target.checked)}/><Checkbox label="Flip vertically" checked={flipY} onChange={e=>setFlipY(e.target.checked)}/></>}
    {slug==='image-remove-metadata'&&<p className="help-text">Re-encoding removes embedded EXIF, camera and GPS tags. It does not hide information visible within the picture. Choose PNG for lossless pixels.</p>}
    <Button style={{marginTop:18}} onClick={process} disabled={task.busy||!preview}>{task.busy?'Working…':tool.name}<ArrowRight size={15}/></Button></fieldset></div>}</div>
    {task.busy&&<Progress value={task.progress} status={task.status} onCancel={task.cancel}/>}
    {task.error&&<p role="alert" className="error-message">{task.error}</p>}
    <Results outputs={outputs} onReset={()=>{setFiles([]);setOutputs([]);setPreview(undefined);task.setError('');}}/>
  </>;
}
