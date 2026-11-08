type ToolGuide = {
  heading: string;
  description: string;
  steps: string[];
  exampleHeading: string;
  example: string;
  relatedSlugs: string[];
};

export const toolGuides: Record<string, ToolGuide | undefined> = {
  'image-dimensions-size': {
    heading: 'Resize a Photo by Dimensions and File Size',
    description: 'Resize a photo in centimeters or pixels and set a maximum file size in KB. Try the 3.5 × 4.5 cm example without uploading your photo.',
    steps: [
      'Add your photo and choose the output format your form accepts.',
      'Choose Centimeters & DPI or Pixels, then enter the required width and height. Crop the photo first if it has a different shape and you want to avoid stretching it.',
      'Enable Use a file size target and enter the maximum size in KB or MB.',
      'Run the tool and check both the dimensions and the final file size before downloading.',
    ],
    exampleHeading: 'Resize a 3.5 × 4.5 cm photo for a form',
    example: 'If your form asks for 3.5 × 4.5 cm at 300 DPI, enter those values to get 413 × 531 pixels. Choose JPG if the form accepts it and select 20 KB if that is its maximum. The tool keeps the pixel dimensions fixed and tells you if the result is still over the limit. Use the requirements on your own form for the dimensions, file type, and size.',
    relatedSlugs: ['image-crop', 'image-target-size', 'image-resizer', 'image-converter'],
  },
  'image-target-size': {
    heading: 'Compress Images to 20 KB, 50 KB or 100 KB',
    description: 'Compress a JPG, PNG or WebP photo to fit a limit such as 20 KB, 50 KB or 100 KB. Pick a preset or enter your own size. Photos stay on your device.',
    steps: [
      'Choose or drop the photos you want to compress.',
      'Select 20 KB, 50 KB, 100 KB, or enter a custom maximum in KB or MB.',
      'Choose an output format your form accepts. Use PNG or WebP if you need to keep a transparent background.',
      'Run the compressor and check the result’s file size and preview before downloading.',
    ],
    exampleHeading: 'Fit a 50 KB photo upload limit',
    example: 'Choose the 50 KB preset to set a maximum of 50,000 bytes. The tool tries lower image quality and, when needed, smaller pixel dimensions. If a form also requires a specific width and height, use Dimensions & File Size to keep those dimensions fixed. Check the result because some images cannot reach a very small target.',
    relatedSlugs: ['image-dimensions-size', 'image-compressor', 'image-resizer', 'image-converter'],
  },
  'image-compressor': {
    heading: 'Compress a Batch of Images',
    description: 'Compress up to 20 images at a time. Choose JPG, PNG or WebP output, adjust quality where supported, and download the results individually or as a ZIP.',
    steps: [
      'Choose up to 20 images from your device.',
      'Select JPG or WebP to adjust quality. Choose PNG for lossless output.',
      'Run the compressor and compare the preview and file size. Enable the size target if you have a maximum in KB or MB.',
      'Download individual images or save the whole batch as a ZIP.',
    ],
    exampleHeading: 'Shrink a batch of photos for email',
    example: 'Start with JPG at about 85% quality and check the preview before saving. Leave the file size target off when your priority is to keep the original pixel dimensions. If each photo has to meet a specific upload limit, set that limit before processing the batch.',
    relatedSlugs: ['image-target-size', 'image-dimensions-size', 'image-resizer', 'image-converter'],
  },
  'pdf-merge': {
    heading: 'Merge PDF Files Without Uploading',
    description: 'Combine two or more PDFs into one file. Reorder documents with drag and drop or the arrow buttons. Merge and download the PDF without uploading your files.',
    steps: [
      'Choose at least two PDF files or drop them into the workspace.',
      'Drag files into the order you want, or use the arrow buttons. The merge includes every page from each file.',
      'Select Merge PDF and download the combined file.',
      'Open the result to check that the documents appear in the right order.',
    ],
    exampleHeading: 'Put a cover letter and résumé in one PDF',
    example: 'Add the cover letter and résumé as separate PDFs, then move the cover letter to the top of the list. For a packet that only needs a few pages from a longer document, extract those pages first and add the smaller PDF to the merge.',
    relatedSlugs: ['pdf-split', 'pdf-extract-pages', 'pdf-reorder', 'pdf-compress'],
  },
  'pdf-split': {
    heading: 'Split a PDF by Page Range',
    description: 'Split a PDF by page range, save every page separately, or make one file for every N pages. Your browser processes the document on your device.',
    steps: [
      'Add the PDF you want to split.',
      'Select Page ranges, Every page separately, or Every N pages under Split mode.',
      'For Page ranges, enter the pages you want to keep. For Every N pages, enter the number of pages per file.',
      'Select Split PDF and download each result or save the group as a ZIP.',
    ],
    exampleHeading: 'Save pages 2 to 4 as a separate PDF',
    example: 'Enter 2-4 in Page selection to get one PDF containing those three pages. To split multiple sections at once, separate the ranges with semicolons. For example, 1-3 followed by a semicolon and 7-9 creates two output files.',
    relatedSlugs: ['pdf-extract-pages', 'pdf-delete-pages', 'pdf-merge', 'pdf-reorder'],
  },
  'pdf-compress': {
    heading: 'Compress a PDF to a File Size Limit',
    description: 'Try to fit a PDF within 200 KB, 500 KB or 1 MB. Choose a preset or a custom size and check the result. Compression runs in your browser.',
    steps: [
      'Add the PDF you want to make smaller.',
      'Choose a compression level and optionally enter the maximum file size or pick a preset.',
      'Select Compress PDF, then compare the resulting size with your limit.',
      'Open the result before submitting it to make sure text and images are still readable.',
    ],
    exampleHeading: 'Fit a scanned PDF under a 500 KB limit',
    example: 'Select 500 KB and check the output size and readability. The compressor rebuilds pages as images, so the output loses selectable text, forms, links, and signatures. If you only need a few pages, try extracting them into a separate PDF and check its size before using image-based compression.',
    relatedSlugs: ['pdf-extract-pages', 'pdf-delete-pages', 'pdf-split', 'pdf-merge'],
  },
};
