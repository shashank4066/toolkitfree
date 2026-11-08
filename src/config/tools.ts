export type CategoryId = 'pdf' | 'image' | 'text' | 'developer' | 'utility';
export type Tool = {
  slug: string;
  name: string;
  category: CategoryId;
  icon: string;
  description: string;
  component: string;
  keywords: string[];
  popular?: boolean;
  seoTitle?: string;
  note?: string;
  heading?: string;
};

export const categories = [
  { id: 'pdf', name: 'PDF Tools', short: 'PDF', icon: 'FileText', description: 'Combine, edit, and convert PDFs.' },
  { id: 'image', name: 'Image Tools', short: 'Image', icon: 'Image', description: 'Resize, compress, and convert images.' },
  { id: 'text', name: 'Text Tools', short: 'Text', icon: 'Type', description: 'Count, compare, and clean up text.' },
  { id: 'developer', name: 'Developer Tools', short: 'Developer', icon: 'Code', description: 'Format code and convert data.' },
  { id: 'utility', name: 'QR & Utilities', short: 'QR & Utility', icon: 'QrCode', description: 'Create codes and run calculations.' },
] as const;

// Tool descriptions serve the catalog and tool pages. Keywords support search aliases.
export const tools: Tool[] = [
  {
    slug: 'pdf-merge',
    name: 'Merge PDF',
    heading: 'Merge PDF Files Online Free — Fast PDF Merger',
    category: 'pdf',
    icon: 'Files',
    description: 'Combine PDFs into one file in the order you choose.',
    component: 'pdf/PdfTools',
    keywords: [
      'merge pdf online free', 'online pdf merger', 'pdf merger', 'combine pdf', 'combine pdf files',
      'merge pdf', 'join pdf', 'pdf joiner', 'pdf combiner online', 'merge multiple pdfs into one',
      'merge pdf pages', 'free pdf binder'
    ],
    seoTitle: 'Merge PDF Online Free — Fast & Private PDF Merger',
    popular: true
  },
  {
    slug: 'pdf-split',
    name: 'Split PDF',
    heading: 'Split PDF Files Online Free — Separate PDF Pages',
    category: 'pdf',
    icon: 'Scissors',
    description: 'Save a page range or split a PDF into several files.',
    component: 'pdf/PdfTools',
    keywords: ['split pdf', 'extract pdf pages', 'pdf splitter online', 'separate pdf pages', 'cut pdf pages', 'split pdf by page range'],
    seoTitle: 'Split PDF Online Free — Extract & Separate PDF Pages',
    popular: true
  },
  {
    slug: 'pdf-compress',
    name: 'Compress PDF',
    heading: 'Compress PDF Online Free — Reduce PDF File Size',
    category: 'pdf',
    icon: 'FileDown',
    description: 'Reduce PDF size with a preset or a KB/MB target.',
    component: 'pdf/PdfTools',
    keywords: ['compress pdf under 200kb', 'reduce pdf size', 'compress pdf online free', 'shrink pdf', 'pdf compressor', 'compress pdf to 100kb', 'compress pdf to 500kb', 'compress pdf to 1mb'],
    seoTitle: 'Compress PDF to 200KB, 500KB or 1MB Online Free',
    popular: true,
    note: 'Compression rebuilds pages as images. Selectable text, forms, links and signatures are not retained. Keep your original.'
  },
  {
    slug: 'pdf-rotate',
    name: 'Rotate PDF',
    heading: 'Rotate PDF Pages Online Free',
    category: 'pdf',
    icon: 'RotateCw',
    description: 'Rotate selected pages by 90°, 180°, or 270°.',
    component: 'pdf/PdfTools',
    keywords: ['rotate pdf pages', 'rotate pdf online', 'turn pdf pages', 'fix upside down pdf'],
    seoTitle: 'Rotate PDF Pages Online Free — 90°, 180°, 270°'
  },
  {
    slug: 'pdf-delete-pages',
    name: 'Delete PDF Pages',
    heading: 'Delete PDF Pages Online Free',
    category: 'pdf',
    icon: 'FileMinus',
    description: 'Select and remove pages from a PDF.',
    component: 'pdf/PdfTools',
    keywords: ['remove pdf pages', 'delete pages from pdf', 'cut pages from pdf'],
    seoTitle: 'Delete Pages from PDF Online Free — Visual PDF Editor'
  },
  {
    slug: 'pdf-extract-pages',
    name: 'Extract PDF Pages',
    heading: 'Extract PDF Pages Online Free',
    category: 'pdf',
    icon: 'Copy',
    description: 'Save selected pages as a separate PDF.',
    component: 'pdf/PdfTools',
    keywords: ['extract pdf pages free', 'export pages from pdf', 'pull pages from pdf'],
    seoTitle: 'Extract PDF Pages Online Free — Save Specific Pages'
  },
  {
    slug: 'pdf-reorder',
    name: 'Reorder PDF Pages',
    heading: 'Reorder & Rearrange PDF Pages Online Free',
    category: 'pdf',
    icon: 'LayoutGrid',
    description: 'Drag page thumbnails into a new order.',
    component: 'pdf/PdfTools',
    keywords: ['rearrange pdf pages', 'reorder pdf pages', 'organize pdf pages', 'move pdf pages'],
    seoTitle: 'Reorder PDF Pages Online Free — Drag & Drop PDF Organizer'
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    heading: 'Convert Image to PDF Online Free (JPG, PNG, WebP)',
    category: 'pdf',
    icon: 'FileImage',
    description: 'Make a PDF from images with your choice of page size and margins.',
    component: 'pdf/PdfTools',
    keywords: ['jpg to pdf', 'png to pdf', 'image to pdf converter', 'convert photo to pdf', 'jpeg to pdf', 'webp to pdf', 'images to pdf online free'],
    seoTitle: 'Image to PDF Converter Online Free — JPG, PNG, WebP to PDF',
    popular: true
  },
  {
    slug: 'pdf-to-image',
    name: 'PDF to Image',
    heading: 'Convert PDF to Image Online Free (JPG, PNG)',
    category: 'pdf',
    icon: 'Images',
    description: 'Export selected PDF pages as JPG or PNG images.',
    component: 'pdf/PdfTools',
    keywords: ['pdf to jpg', 'pdf to png', 'convert pdf to image', 'save pdf as picture', 'extract images from pdf'],
    seoTitle: 'PDF to Image Converter Online Free — Save PDF as JPG & PNG'
  },
  {
    slug: 'pdf-page-numbers',
    name: 'Add Page Numbers',
    heading: 'Add Page Numbers to PDF Online Free',
    category: 'pdf',
    icon: 'ListOrdered',
    description: 'Add page numbers at the top or bottom of your PDF.',
    component: 'pdf/PdfTools',
    keywords: ['add page numbers pdf', 'number pdf pages', 'insert page numbers in pdf'],
    seoTitle: 'Add Page Numbers to PDF Online Free — Top & Bottom Numbering'
  },
  {
    slug: 'pdf-watermark',
    name: 'Watermark PDF',
    heading: 'Add Watermark to PDF Online Free',
    category: 'pdf',
    icon: 'Stamp',
    description: 'Add a text watermark with adjustable size, angle, and opacity.',
    component: 'pdf/PdfTools',
    keywords: ['add watermark pdf', 'watermark pdf online free', 'stamp pdf', 'confidential watermark pdf'],
    seoTitle: 'Watermark PDF Online Free — Add Custom Text Watermark'
  },
  {
    slug: 'pdf-protect',
    name: 'Protect PDF',
    heading: 'Protect PDF with Password Online Free',
    category: 'pdf',
    icon: 'Lock',
    description: 'Encrypt a PDF with a password using AES-256.',
    component: 'pdf/PdfTools',
    keywords: ['password protect pdf', 'encrypt pdf online', 'lock pdf with password'],
    seoTitle: 'Password Protect PDF Online Free — AES-256 Encryption',
    note: 'Store your password safely. It is processed locally and cannot be recovered by this website.'
  },
  {
    slug: 'pdf-unlock',
    name: 'Unlock PDF',
    heading: 'Unlock PDF Online Free — Remove PDF Password',
    category: 'pdf',
    icon: 'Unlock',
    description: 'Remove encryption from a PDF using its existing password.',
    component: 'pdf/PdfTools',
    keywords: ['unlock pdf with password', 'remove pdf password', 'decrypt pdf online'],
    seoTitle: 'Unlock PDF Online Free — Remove Known Password',
    note: 'Enter the existing password. This tool does not guess or recover forgotten passwords.'
  },
  {
    slug: 'image-compressor',
    name: 'Compress Image',
    heading: 'Compress Image Online Free — Fast Image Compressor',
    category: 'image',
    icon: 'Minimize2',
    description: 'Compress a batch of images by quality or file size.',
    component: 'image/ImageTools',
    keywords: [
      'compress image', 'online image compressor', 'image compressor online', 'compress photo online',
      'reduce image size', 'compress jpg', 'compress png', 'compress webp', 'shrink image size',
      'compress image without losing quality', 'photo size reducer'
    ],
    seoTitle: 'Compress Image Online Free — Fast Image Compressor (JPG, PNG, WebP)',
    popular: true
  },
  {
    slug: 'image-target-size',
    name: 'Compress to KB / MB',
    heading: 'Compress Image to 10KB, 20KB, 50KB, 100KB Online Free',
    category: 'image',
    icon: 'Target',
    description: 'Compress an image to fit a maximum size in KB or MB.',
    component: 'image/ImageTools',
    keywords: [
      'compress image to 10kb', 'compress image to 20kb', 'compress image to 50kb', 'compress image to 100kb',
      'compress image to 200kb', 'online image compressor to 10 kb', 'image compressor to 10kb', 'image compressor to 20kb',
      'image compressor to 50kb', 'compress image to exact size', 'compress photo under 50kb', 'compress photo to 20kb',
      'reduce photo size in kb', 'resize image to 50kb', 'compress image under 100kb', 'passport photo 50 kb',
      'government form photo 100 kb', 'signature compress to 10kb', 'signature compress to 20kb'
    ],
    seoTitle: 'Compress Image to 10KB, 20KB, 50KB, 100KB Online Free',
    popular: true
  },
  {
    slug: 'image-resizer',
    name: 'Resize Image',
    heading: 'Resize Image Online Free — Change Photo Pixels & Dimensions',
    category: 'image',
    icon: 'Expand',
    description: 'Set pixel dimensions, scale by percentage, or use a preset.',
    component: 'image/ImageTools',
    keywords: [
      'resize image online free', 'resize image pixels', 'image resizer online', 'resize photo',
      'change image dimensions', 'scale photo online', 'resize image for instagram', 'youtube thumbnail resizer'
    ],
    seoTitle: 'Resize Image Online Free — Change Photo Dimensions & Pixels',
    popular: true
  },
  {
    slug: 'image-dimensions-size',
    name: 'Dimensions & File Size',
    heading: 'Resize Image to Dimensions & File Size (e.g. 20KB, 50KB, cm)',
    category: 'image',
    icon: 'Ruler',
    description: 'Set image dimensions and an optional file size target.',
    component: 'image/ImageTools',
    keywords: [
      'image resize to 20 kb', 'image resize to 20kb', 'resize image to 20kb', 'resize image to 50kb',
      'resize image to 100kb', '3.5cm 4.5cm photo under 50kb', 'passport photo resizer', 'photo resize in cm and kb',
      'resize photo for exam form', 'dimensions and file size together', 'resize photo to exact kb and cm',
      'signature resize 20kb', 'photo resize 20kb'
    ],
    seoTitle: 'Resize Image to 20KB, 50KB Dimensions & File Size Online Free'
  },
  {
    slug: 'image-crop',
    name: 'Crop Image',
    heading: 'Crop Image Online Free — 1:1, 4:3, 16:9 & Free Crop',
    category: 'image',
    icon: 'Crop',
    description: 'Crop freely or use a fixed aspect ratio.',
    component: 'image/ImageTools',
    keywords: ['crop image online', 'crop photo online free', 'square crop photo', 'image cropper'],
    seoTitle: 'Crop Image Online Free — Free & Fixed Ratio Photo Cropper'
  },
  {
    slug: 'image-converter',
    name: 'Convert Image Format',
    heading: 'Convert Image Format Online Free (HEIC, WebP, JPG, PNG, AVIF)',
    category: 'image',
    icon: 'RefreshCw',
    description: 'Convert JPG, PNG, WebP, AVIF, and HEIC images.',
    component: 'image/ImageTools',
    keywords: ['heic to jpg', 'webp to jpg', 'avif to jpg', 'png to jpg', 'jpg to png', 'convert image format online free'],
    seoTitle: 'Convert Image Format Online Free — HEIC, WebP, JPG, PNG Converter'
  },
  {
    slug: 'image-rotate',
    name: 'Rotate & Flip Image',
    heading: 'Rotate & Flip Image Online Free',
    category: 'image',
    icon: 'RotateCw',
    description: 'Rotate a photo or flip it horizontally or vertically.',
    component: 'image/ImageTools',
    keywords: ['flip image', 'rotate photo', 'mirror image online', 'rotate photo 90 degrees'],
    seoTitle: 'Rotate & Flip Image Online Free — Mirror & Turn Photos'
  },
  {
    slug: 'image-remove-metadata',
    name: 'Remove Image Metadata',
    heading: 'Remove EXIF & GPS Metadata from Photos Online Free',
    category: 'image',
    icon: 'ShieldCheck',
    description: 'Remove camera details and embedded GPS tags.',
    component: 'image/ImageTools',
    keywords: ['remove exif', 'strip photo metadata', 'remove gps from photo', 'clear exif data online free'],
    seoTitle: 'Remove Image Metadata & EXIF Online Free — Protect Photo Privacy'
  },
  {
    slug: 'image-to-base64',
    name: 'Image to Base64',
    heading: 'Convert Image to Base64 Online Free',
    category: 'image',
    icon: 'Binary',
    description: 'Copy an image as a Base64 data URL.',
    component: 'image/Base64Image',
    keywords: ['image to base64', 'convert image to data url', 'base64 image encoder'],
    seoTitle: 'Image to Base64 Converter Online Free — Data URL Generator'
  },
  {
    slug: 'base64-to-image',
    name: 'Base64 to Image',
    heading: 'Convert Base64 to Image Online Free',
    category: 'image',
    icon: 'FileImage',
    description: 'Decode a Base64 string and save it as an image.',
    component: 'image/Base64Image',
    keywords: ['base64 to image', 'decode base64 to image', 'base64 image viewer'],
    seoTitle: 'Base64 to Image Converter Online Free — Decode & Download'
  },
  {
    slug: 'image-color-picker',
    name: 'Image Color Picker',
    heading: 'Image Color Picker Online Free — Pick Hex, RGB from Photos',
    category: 'image',
    icon: 'Pipette',
    description: 'Pick a pixel and copy its HEX color.',
    component: 'image/ColorPicker',
    keywords: ['pick color from image', 'image color picker online', 'extract color from photo', 'hex color from image'],
    seoTitle: 'Image Color Picker Online Free — Pick Colors from Any Photo'
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    heading: 'Case Converter Online Free (UPPER, lower, camelCase, snake_case)',
    category: 'text',
    icon: 'CaseSensitive',
    description: 'Switch between upper, lower, title, and programming cases.',
    component: 'text/TextTools',
    keywords: ['case converter', 'camelcase', 'snake_case', 'uppercase converter', 'title case converter', 'kebab-case converter'],
    seoTitle: 'Case Converter Online Free — Change Text Case Easily'
  },
  {
    slug: 'word-counter',
    name: 'Word & Character Counter',
    heading: 'Word & Character Counter Online Free',
    category: 'text',
    icon: 'Hash',
    description: 'Count words, characters, and estimated reading time.',
    component: 'text/TextTools',
    keywords: ['word counter', 'character count', 'count words online', 'reading time calculator', 'sentence counter'],
    seoTitle: 'Word & Character Counter Online Free — Word, Char & Reading Time'
  },
  {
    slug: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    heading: 'Remove Duplicate Lines Online Free',
    category: 'text',
    icon: 'Copy',
    description: 'Keep one copy of each line of text.',
    component: 'text/TextTools',
    keywords: ['deduplicate text lines', 'remove duplicate lines online', 'unique lines extractor'],
    seoTitle: 'Remove Duplicate Lines Online Free — Fast Text Deduplicator'
  },
  {
    slug: 'sort-lines',
    name: 'Sort Lines',
    heading: 'Sort Lines Alphabetically (A-Z, Z-A) Online Free',
    category: 'text',
    icon: 'ListOrdered',
    description: 'Sort lines alphabetically, by length, or at random.',
    component: 'text/TextTools',
    keywords: ['alphabetize lines', 'sort text lines', 'sort a-z online', 'shuffle text lines'],
    seoTitle: 'Sort Lines Online Free — Alphabetical A-Z, Z-A & Shuffle'
  },
  {
    slug: 'clean-text',
    name: 'Clean Up Text',
    heading: 'Clean Up Text Online Free — Remove Extra Spaces & Line Breaks',
    category: 'text',
    icon: 'Eraser',
    description: 'Trim line edges or remove extra spaces and line breaks.',
    component: 'text/TextTools',
    keywords: ['remove extra spaces', 'remove line breaks', 'clean text online', 'trim whitespace'],
    seoTitle: 'Clean Up Text Online Free — Remove Extra Spaces & Line Breaks'
  },
  {
    slug: 'text-diff',
    name: 'Text Diff Checker',
    heading: 'Text Diff Checker Online Free — Compare Two Texts Side-by-Side',
    category: 'text',
    icon: 'Columns2',
    description: 'Compare two versions of text side by side.',
    component: 'text/TextTools',
    keywords: ['compare text', 'text diff', 'diff checker online', 'find text differences'],
    seoTitle: 'Text Diff Checker Online Free — Side-by-Side Text Comparison'
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    heading: 'Lorem Ipsum Generator Online Free',
    category: 'text',
    icon: 'Type',
    description: 'Generate placeholder text by paragraph.',
    component: 'text/TextTools',
    keywords: ['lorem ipsum generator', 'placeholder text generator', 'dummy text online'],
    seoTitle: 'Lorem Ipsum Generator Online Free — Custom Dummy Text'
  },
  {
    slug: 'find-replace',
    name: 'Find & Replace',
    heading: 'Find & Replace Text Online Free (Regex Supported)',
    category: 'text',
    icon: 'Search',
    description: 'Replace text using a literal phrase or regular expression.',
    component: 'text/TextTools',
    keywords: ['find and replace text online', 'regex find replace', 'replace words in text'],
    seoTitle: 'Find & Replace Text Online Free — Simple & Regex Search'
  },
  {
    slug: 'slug-generator',
    name: 'Slug Generator',
    heading: 'URL Slug Generator Online Free',
    category: 'text',
    icon: 'Link',
    description: 'Turn a title into a URL slug.',
    component: 'text/TextTools',
    keywords: ['url slug generator', 'string to slug', 'generate seo slug'],
    seoTitle: 'URL Slug Generator Online Free — SEO-Friendly Slugs'
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    heading: 'JSON Formatter, Validator & Minifier Online Free',
    category: 'developer',
    icon: 'Braces',
    description: 'Format, validate, or minify JSON and browse its tree.',
    component: 'developer/JsonTool',
    keywords: ['json formatter', 'json validator', 'json minifier', 'format json online', 'beautify json', 'json viewer tree'],
    seoTitle: 'JSON Formatter, Validator & Minifier Online Free',
    popular: true
  },
  {
    slug: 'json-csv',
    name: 'JSON ↔ CSV',
    heading: 'JSON to CSV & CSV to JSON Converter Online Free',
    category: 'developer',
    icon: 'Table',
    description: 'Convert between CSV and flat JSON records.',
    component: 'developer/DeveloperTools',
    keywords: ['json to csv', 'csv to json', 'convert json to spreadsheet', 'parse csv to json'],
    seoTitle: 'JSON to CSV & CSV to JSON Converter Online Free'
  },
  {
    slug: 'base64',
    name: 'Base64 Encode / Decode',
    heading: 'Base64 Encoder & Decoder Online Free (UTF-8 Supported)',
    category: 'developer',
    icon: 'Binary',
    description: 'Encode and decode Unicode text as Base64.',
    component: 'developer/DeveloperTools',
    keywords: ['base64 encode', 'base64 decode', 'base64 converter online', 'utf8 base64'],
    seoTitle: 'Base64 Encode & Decode Online Free — UTF-8 String Converter'
  },
  {
    slug: 'url-encoder',
    name: 'URL Encode / Decode',
    heading: 'URL Encoder & Decoder Online Free',
    category: 'developer',
    icon: 'Link',
    description: 'Encode or decode special characters in URLs.',
    component: 'developer/DeveloperTools',
    keywords: ['url encode decode', 'url encoder online', 'uri decode', 'percent encoding'],
    seoTitle: 'URL Encode & Decode Online Free — Percent-Encoding Converter'
  },
  {
    slug: 'code-formatter',
    name: 'Code Minifier & Beautifier',
    heading: 'HTML, CSS & JavaScript Minifier & Beautifier Online Free',
    category: 'developer',
    icon: 'Code',
    description: 'Format or minify HTML, CSS, and JavaScript.',
    component: 'developer/DeveloperTools',
    keywords: ['js minifier', 'html beautifier', 'css formatter', 'minify javascript', 'beautify html'],
    seoTitle: 'HTML, CSS & JS Minifier & Beautifier Online Free'
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    heading: 'Regex Tester Online Free — Live Regular Expression Matcher',
    category: 'developer',
    icon: 'Regex',
    description: 'Highlight matches for a regular expression as you type.',
    component: 'developer/DeveloperTools',
    keywords: ['regex tester', 'regular expression tester online', 'test regex', 'regex debugger'],
    seoTitle: 'Regex Tester Online Free — Live Pattern Highlighting'
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    heading: 'UUID Generator Online Free — Batch v4 UUIDs',
    category: 'developer',
    icon: 'Fingerprint',
    description: 'Generate one or more random v4 UUIDs.',
    component: 'developer/DeveloperTools',
    keywords: ['uuid generator', 'guid generator', 'random uuid v4', 'batch uuid generator'],
    seoTitle: 'UUID v4 Generator Online Free — Bulk Cryptographic GUIDs'
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    heading: 'Hash Generator Online Free — MD5, SHA-1, SHA-256',
    category: 'developer',
    icon: 'Hash',
    description: 'Calculate MD5, SHA-1, or SHA-256 hashes from text.',
    component: 'developer/DeveloperTools',
    keywords: ['sha256 generator', 'md5 hash', 'sha1 generator', 'hash text online free'],
    seoTitle: 'Hash Generator Online Free — MD5, SHA-1, SHA-256 Checksums',
    note: 'MD5 and SHA-1 are for compatibility checks, not secure password storage.'
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    heading: 'JWT Decoder Online Free — Inspect JSON Web Tokens',
    category: 'developer',
    icon: 'KeyRound',
    description: 'Inspect the header and payload of a JWT.',
    component: 'developer/DeveloperTools',
    keywords: ['jwt decoder', 'decode jwt online', 'inspect json web token', 'jwt viewer'],
    seoTitle: 'JWT Decoder Online Free — Decode Header & Payload Safely',
    note: 'Decoding does not verify the signature, issuer or authenticity of a token.'
  },
  {
    slug: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    heading: 'Unix Timestamp Converter Online Free (Seconds & Milliseconds)',
    category: 'developer',
    icon: 'Clock',
    description: 'Convert between Unix timestamps and dates.',
    component: 'developer/DeveloperTools',
    keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date', 'current unix timestamp'],
    seoTitle: 'Unix Timestamp Converter Online Free — Epoch to Human Date'
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    heading: 'Color Converter Online Free — HEX, RGB, HSL',
    category: 'developer',
    icon: 'Palette',
    description: 'Convert colors between HEX, RGB, and HSL.',
    component: 'developer/DeveloperTools',
    keywords: ['hex to rgb', 'rgb to hsl', 'color converter online free', 'hsl to hex'],
    seoTitle: 'Color Converter Online Free — HEX, RGB, HSL Palette Converter'
  },
  {
    slug: 'xml-yaml',
    name: 'XML & YAML Tools',
    heading: 'XML Formatter & YAML to JSON Converter Online Free',
    category: 'developer',
    icon: 'FileCode',
    description: 'Format XML or convert between YAML and JSON.',
    component: 'developer/DeveloperTools',
    keywords: ['xml formatter', 'yaml to json', 'json to yaml', 'beautify xml online'],
    seoTitle: 'XML Formatter & YAML to JSON Converter Online Free'
  },
  {
    slug: 'qr-generator',
    name: 'QR Code Generator',
    heading: 'QR Code Generator Online Free with Logo (URL, Wi-Fi, UPI)',
    category: 'utility',
    icon: 'QrCode',
    description: 'Create a QR code and save it as PNG or SVG.',
    component: 'utility/QrTool',
    keywords: [
      'free qr generator', 'qr code generator', 'upi qr code', 'wifi qr code generator',
      'qr code with logo', 'custom qr code maker', 'svg qr code'
    ],
    seoTitle: 'QR Code Generator Online Free — URL, Wi-Fi, UPI & Logo',
    popular: true
  },
  {
    slug: 'barcode-generator',
    name: 'Barcode Generator',
    heading: 'Barcode Generator Online Free (CODE128, EAN-13, UPC)',
    category: 'utility',
    icon: 'Barcode',
    description: 'Generate CODE128, EAN, UPC, and other barcodes.',
    component: 'utility/UtilityTools',
    keywords: ['barcode generator', 'create barcode online', 'code128 barcode generator', 'ean13 generator'],
    seoTitle: 'Barcode Generator Online Free — CODE128, EAN, UPC Maker'
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    heading: 'Strong Password Generator Online Free — Private & Random',
    category: 'utility',
    icon: 'KeyRound',
    description: 'Generate a random password with your preferred character types.',
    component: 'utility/UtilityTools',
    keywords: ['strong password generator', 'random password generator', 'secure password maker'],
    seoTitle: 'Password Generator Online Free — Cryptographic & Private'
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    heading: 'Unit Converter Online Free — Length, Weight, Temperature, Data',
    category: 'utility',
    icon: 'ArrowRightLeft',
    description: 'Convert units of length, weight, temperature, and data.',
    component: 'utility/UtilityTools',
    keywords: ['unit converter', 'convert length', 'convert weight', 'data size converter', 'temperature converter'],
    seoTitle: 'Unit Converter Online Free — Length, Weight, Data & Temp'
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    heading: 'Age Calculator Online Free — Exact Years, Months & Days',
    category: 'utility',
    icon: 'Calendar',
    description: 'Find the years, months, and days between two dates.',
    component: 'utility/UtilityTools',
    keywords: ['age calculator', 'calculate age from date of birth', 'exact age calculator online free'],
    seoTitle: 'Age Calculator Online Free — Exact Age in Years, Months, Days'
  },
  {
    slug: 'emi-calculator',
    name: 'EMI Calculator',
    heading: 'Loan EMI Calculator Online Free — Monthly Repayments & Interest',
    category: 'utility',
    icon: 'Calculator',
    description: 'Estimate monthly loan payments and total interest.',
    component: 'utility/UtilityTools',
    keywords: ['loan emi calculator', 'car loan emi', 'home loan emi calculator', 'monthly payment calculator'],
    seoTitle: 'Loan EMI Calculator Online Free — Monthly Repayments & Total Interest',
    note: 'An arithmetic estimate only. Fees, lender terms and rate changes are not included.'
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    heading: 'Percentage Calculator Online Free — % Of, % What, % Change',
    category: 'utility',
    icon: 'Percent',
    description: 'Calculate a percentage or the change between values.',
    component: 'utility/UtilityTools',
    keywords: ['percentage calculator', 'calculate percentage', 'percent change calculator', 'what percent of'],
    seoTitle: 'Percentage Calculator Online Free — % Of, % What, % Change'
  },
];

export const popularSlugs = [
  'pdf-merge',
  'image-compressor',
  'pdf-compress',
  'image-resizer',
  'pdf-split',
  'image-to-pdf',
  'json-formatter',
  'qr-generator'
];

export const commonFaq = [
  { question: 'Are the tools free?', answer: 'Yes. You can use every tool without an account, payment, or daily quota. The website adds no watermark.' },
  { question: 'Where are my files processed?', answer: 'Your browser processes files and text on your device. The website does not upload your inputs.' },
  { question: 'What file sizes can I use?', answer: 'Available browser memory and file complexity determine what will work. Image tools process up to 20 files per batch. Try smaller batches for large images.' },
  { question: 'Can I use the tools on my phone?', answer: 'Yes. Use a current browser on your phone, tablet, or computer. Image format support varies by browser.' },
  { question: 'Can I use the tools offline?', answer: 'Open a tool and run it while online first. Your browser can reuse the cached application and libraries offline.' },
];

// Stemming dictionary for natural user searches
const stemDictionary: Record<string, string> = {
  merger: 'merge', merging: 'merge', combine: 'merge', combiner: 'merge', combining: 'merge', join: 'merge', joiner: 'merge', joining: 'merge',
  compressor: 'compress', compressing: 'compress', compression: 'compress', shrink: 'compress', reduce: 'compress', reducer: 'compress', reducing: 'compress',
  resizer: 'resize', resizing: 'resize', scale: 'resize', scaler: 'resize', dimension: 'resize', dimensions: 'resize',
  converter: 'convert', converting: 'convert',
  maker: 'generator', generating: 'generator', generate: 'generator', create: 'generator', creator: 'generator',
  photo: 'image', photos: 'image', picture: 'image', pictures: 'image', pic: 'image', pics: 'image',
  document: 'pdf', documents: 'pdf', doc: 'pdf', docs: 'pdf',
  splitter: 'split', splitting: 'split', extractor: 'extract', extracting: 'extract',
};

const stopWords = new Set([
  'online', 'free', 'tool', 'tools', 'to', 'the', 'a', 'an', 'in', 'for', 'with', 'and', 'or', 'of', 'my', 'how', 'can', 'i', 'please', 'website', 'best'
]);

function stemToken(token: string): string {
  return stemDictionary[token] || token;
}

export type SearchIntent = {
  target?: number;
  unit?: 'KB' | 'MB';
  dimensions?: { width?: number; height?: number; units?: 'px' | 'cm' };
};

export function parseSearchIntent(query: string): SearchIntent {
  const raw = query.toLowerCase().trim();
  const sizeMatch = raw.match(/(\d+(?:\.\d+)?)\s*(kb|mb|bytes)?\b/);
  const target = sizeMatch ? Number(sizeMatch[1]) : undefined;
  const unit = sizeMatch && sizeMatch[2] ? (sizeMatch[2].toUpperCase() === 'MB' ? 'MB' : 'KB') : (target ? 'KB' : undefined);
  return { target, unit };
}

export function searchTools(query: string): Tool[] {
  if (!query || !query.trim()) return tools;
  const raw = query.toLowerCase().trim();
  const intent = parseSearchIntent(raw);

  // Extract tokens
  const cleanTokens = raw.replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(Boolean);
  const filteredTokens = cleanTokens.filter(t => !stopWords.has(t));
  const tokens = (filteredTokens.length ? filteredTokens : cleanTokens).map(stemToken);

  const scored: { tool: Tool; score: number }[] = [];

  for (const tool of tools) {
    let score = 0;
    const tSlug = tool.slug.toLowerCase();
    const tName = tool.name.toLowerCase();
    const tHeading = (tool.heading || '').toLowerCase();
    const tDesc = tool.description.toLowerCase();
    const tKeywords = tool.keywords.map(k => k.toLowerCase());
    const allKeywords = tKeywords.join(' ');

    // 1. Exact raw query matching
    if (tSlug === raw || ('/' + tSlug) === raw) score += 150;
    if (tName.includes(raw) || tHeading.includes(raw)) score += 90;
    if (tKeywords.some(k => k === raw || raw.includes(k) || k.includes(raw))) score += 75;

    // 2. Intent matching: if user searched for specific size like "10 kb", "20 kb", "50 kb"
    if (intent.target) {
      if (raw.includes('compress') || raw.includes('image') || raw.includes('photo')) {
        if (tool.slug === 'image-target-size') score += 120;
        if (tool.slug === 'image-compressor') score += 80;
      }
      if (raw.includes('resize') || raw.includes('dimension')) {
        if (tool.slug === 'image-dimensions-size') score += 120;
        if (tool.slug === 'image-target-size') score += 90;
        if (tool.slug === 'image-resizer') score += 70;
      }
      if (raw.includes('pdf')) {
        if (tool.slug === 'pdf-compress') score += 120;
      }
    }

    // 3. Specific high-intent mappings
    if (tokens.includes('merge') && tokens.includes('pdf')) {
      if (tool.slug === 'pdf-merge') score += 140;
    }
    if (tokens.includes('split') && tokens.includes('pdf')) {
      if (tool.slug === 'pdf-split') score += 140;
    }

    // 4. Token-by-token matching against name, keywords, description, category
    let matchedTokenCount = 0;
    for (const token of tokens) {
      let matched = false;
      if (tName.includes(token) || tHeading.includes(token)) {
        score += 35;
        matched = true;
      }
      if (allKeywords.includes(token)) {
        score += 25;
        matched = true;
      }
      if (tool.category.includes(token)) {
        score += 15;
        matched = true;
      }
      if (tDesc.includes(token)) {
        score += 10;
        matched = true;
      }
      if (matched) matchedTokenCount++;
    }

    // Bonus for matching multiple query terms
    if (matchedTokenCount > 0) {
      score += (matchedTokenCount / tokens.length) * 40;
    }

    if (tool.popular) score += 2;

    if (score > 10) {
      scored.push({ tool, score });
    }
  }

  return scored.sort((a, b) => b.score - a.score).map(s => s.tool);
}

// Generate the direct destination URL with prefilled query parameters based on user query
export function getDirectToolUrl(query: string): string | null {
  const results = searchTools(query);
  if (!results.length) return null;
  const best = results[0];
  const intent = parseSearchIntent(query);

  const params = new URLSearchParams();
  if (intent.target) {
    params.set('target', String(intent.target));
    if (intent.unit) params.set('unit', intent.unit);
  }

  const queryStr = params.toString();
  return '/' + best.slug + (queryStr ? '?' + queryStr : '');
}
