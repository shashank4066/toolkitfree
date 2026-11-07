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
  { id: 'pdf', name: 'PDF Tools', short: 'PDF', icon: 'FileText', description: 'A little less paperwork. A lot more done.' },
  { id: 'image', name: 'Image Tools', short: 'Image', icon: 'Image', description: 'Make every image the perfect fit.' },
  { id: 'text', name: 'Text Tools', short: 'Text', icon: 'Type', description: 'Clean up your words in a few clicks.' },
  { id: 'developer', name: 'Developer Tools', short: 'Developer', icon: 'Code', description: 'Small utilities for your next big idea.' },
  { id: 'utility', name: 'QR & Utilities', short: 'QR & Utility', icon: 'QrCode', description: 'Everyday essentials, all in one place.' },
] as const;

// Comprehensive catalog with high-intent keywords for direct search and top Google rankings.
export const tools: Tool[] = [
  {
    slug: 'pdf-merge',
    name: 'Merge PDF',
    heading: 'Merge PDF Files Online Free — Fast PDF Merger',
    category: 'pdf',
    icon: 'Files',
    description: 'Combine multiple PDF files into one neat document. Fast, private, and 100% free with no limits.',
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
    description: 'Separate pages or extract just what you need into a new PDF or ZIP archive.',
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
    description: 'Reduce PDF file size to under 200 KB, 500 KB, 1 MB or custom target size right in your browser.',
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
    description: 'Turn selected pages 90, 180, or 270 degrees the right way around permanently.',
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
    description: 'Remove unwanted pages with a visual thumbnail preview in seconds.',
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
    description: 'Save selected pages into a fresh, standalone PDF document.',
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
    description: 'Drag and drop page thumbnails into exactly the order you want.',
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
    description: 'Turn JPG, PNG and WebP images into a clean PDF with custom page size and margins.',
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
    description: 'Save your PDF pages as crisp JPG or PNG images with custom DPI resolution.',
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
    description: 'Give your PDF document clean, easy-to-follow page numbers with custom position.',
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
    description: 'Add your own text watermark to every page with custom opacity and rotation.',
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
    description: 'Add a password with strong AES-256 encryption locally in your browser.',
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
    description: 'Remove a PDF password you already know for easier sharing and editing.',
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
    description: 'Reduce image file size with quality slider, batch upload, and before/after comparison.',
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
    description: 'Compress images to exact target sizes: under 10 KB, 20 KB, 50 KB, 100 KB, 200 KB, 500 KB or custom KB/MB.',
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
    description: 'Resize images by pixels, percentage, or social media presets with aspect ratio lock.',
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
    description: 'Set pixels or centimeters (e.g. 3.5cm x 4.5cm) and target file size (under 20 KB, 50 KB) together.',
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
    description: 'Keep the best part. Crop photos freely or with fixed ratios (1:1, 4:3, 16:9) instantly in your browser.',
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
    description: 'Convert JPG, PNG, WebP, AVIF and iPhone HEIC photos to any format effortlessly.',
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
    description: 'Rotate, mirror or flip a photo horizontally or vertically in seconds.',
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
    description: 'Strip embedded EXIF, camera info and GPS location metadata for privacy before sharing.',
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
    description: 'Turn an image into a ready-to-use Base64 data URL string for HTML, CSS, or API requests.',
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
    description: 'Preview and download an encoded Base64 string or data URL as a JPG or PNG file.',
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
    description: 'Click any pixel in your image to inspect and copy its exact HEX, RGB, and HSL color values.',
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
    description: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case.',
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
    description: 'Count words, characters, sentences, paragraphs and calculate estimated reading time in real time.',
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
    description: 'Deduplicate text lines with case-sensitivity and whitespace trimming options.',
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
    description: 'Sort text lines A–Z, Z–A, by length, or shuffle them randomly in one click.',
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
    description: 'Strip unwanted extra spaces, repeated line breaks, and trim line edges cleanly.',
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
    description: 'Compare two texts side-by-side and highlight additions, deletions, and subtle differences.',
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
    description: 'Generate clean placeholder dummy text for mockups, prototypes, and web design.',
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
    description: 'Find and replace text with case-matching and full regular expression (regex) support.',
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
    description: 'Turn headlines and article titles into clean, SEO-friendly URL slugs.',
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
    description: 'Format, validate, beautify, and minify JSON with syntax highlighting and collapsible tree view.',
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
    description: 'Convert JSON data to CSV spreadsheets and parse CSV files into structured JSON format.',
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
    description: 'Encode and decode Unicode text with Base64 safely in your browser.',
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
    description: 'Encode special characters for URLs or decode encoded query strings back into plain text.',
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
    description: 'Clean up or minify your HTML, CSS and JavaScript code locally in seconds.',
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
    description: 'Test regular expressions against sample text with live color-coded match highlighting.',
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
    description: 'Generate cryptographically random UUID v4 identifiers in batches of up to 1,000.',
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
    description: 'Generate MD5, SHA-1 and SHA-256 cryptographic hashes from text securely on your device.',
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
    description: 'Decode and inspect JWT header and payload claims securely in your browser without transmitting secrets.',
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
    description: 'Convert Unix epoch timestamps to human-readable UTC and local dates, or dates to timestamps.',
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
    description: 'Convert between HEX, RGB, and HSL color values with an interactive color picker.',
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
    description: 'Format and beautify XML or convert YAML configurations to JSON and back.',
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
    description: 'Generate custom QR codes for URLs, text, Wi-Fi networks, WhatsApp, and UPI payments. Download in PNG or SVG.',
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
    description: 'Create CODE128, CODE39, EAN-13, EAN-8, UPC, and ITF-14 barcodes in crisp SVG and PNG formats.',
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
    description: 'Generate high-entropy, cryptographically strong random passwords with custom symbols and length.',
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
    description: 'Convert between everyday units of length, weight, temperature, and decimal/binary data sizes.',
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
    description: 'Calculate your exact age in years, months, and days from date of birth.',
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
    description: 'Estimate monthly loan repayments, total interest, and total payable amount with clear breakdown.',
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
    description: 'Calculate percentages, what percentage A is of B, and percentage increase or decrease instantly.',
    component: 'utility/UtilityTools',
    keywords: ['percentage calculator', 'calculate percentage', 'percent change calculator', 'what percent of'],
    seoTitle: 'Percentage Calculator Online Free — % Of, % What, % Change'
  },
];

export const popularSlugs = [
  'pdf-merge',
  'image-compressor',
  'image-target-size',
  'pdf-compress',
  'image-resizer',
  'pdf-split',
  'image-to-pdf',
  'json-formatter',
  'qr-generator'
];

export const commonFaq = [
  { question: 'Is it really completely free?', answer: 'Yes. Every tool is 100% free to use, with no account, trial, credit card or daily usage quota. We never add a watermark to your output.' },
  { question: 'Are my files safe?', answer: 'All file and text processing happens securely in your browser using modern WebAssembly and Canvas technology. Your files and photos never leave your device and are never uploaded to any server.' },
  { question: 'Are there any file size limits?', answer: 'There are no artificial limits or daily quotas. Your device’s memory and browser determine what it can handle. Images are processed in batches of up to 20 to keep things fast.' },
  { question: 'Does it work on my phone?', answer: 'Yes. It works seamlessly on modern versions of Chrome, Safari, Edge, and Firefox across mobile phones, tablets, and desktop computers.' },
  { question: 'Can I use the tools offline?', answer: 'Yes. Once cached after your initial visit, the core application and downloaded tool modules are available offline as a Progressive Web App (PWA).' },
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
