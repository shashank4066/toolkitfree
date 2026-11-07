declare module '@neslinesli93/qpdf-wasm' {
  interface Qpdf { FS:{writeFile:(path:string,data:Uint8Array)=>void;readFile:(path:string)=>Uint8Array};callMain:(args:string[])=>number; }
  export default function create(options:Record<string,unknown>):Promise<Qpdf>;
}
