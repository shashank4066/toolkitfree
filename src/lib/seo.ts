import { site } from '../config/site';
import { commonFaq, tools, type Tool } from '../config/tools';

export function toolFaq(tool: Tool) {
  const specificFaqs: Record<string, { question: string; answer: string }[]> = {
    'image-target-size': [
      {
        question: 'Can I compress an image to exact file sizes like 10 KB, 20 KB or 50 KB?',
        answer: 'Yes! ToolKitFree iteratively optimizes image quality and pixel dimensions client-side to bring your file strictly under 10 KB, 20 KB, 50 KB, 100 KB, or any custom target size you specify. This is ideal for job portals, government exams, and passport or visa applications where file limits are strict.'
      },
      {
        question: 'How do I compress an image to 10 KB online for free?',
        answer: 'Upload your JPG, PNG or WebP file to the workspace, select or enter 10 KB as the target file size, and click Compress. The browser will automatically scale and compress the image to be under 10 KB while preserving as much detail as possible.'
      },
      {
        question: 'Will my image be watermarked or uploaded anywhere?',
        answer: 'No. All processing happens entirely inside your browser on your device. Your photos are never uploaded to any server, and no watermark is ever added.'
      }
    ],
    'pdf-merge': [
      {
        question: 'How do I merge multiple PDF files online for free?',
        answer: 'Select or drag and drop two or more PDF files into the workspace, drag to rearrange them in your desired order, and click "Merge PDF". Your merged file is ready to download in seconds.'
      },
      {
        question: 'Is there a limit on how many PDFs I can combine?',
        answer: 'No! There is no daily limit, no page limit, and no fee. Because merging happens locally on your computer or phone using WebAssembly, you can combine as many files as your device memory allows.'
      },
      {
        question: 'Are my private PDF documents secure?',
        answer: '100% secure. ToolKitFree processes files entirely in your browser. Unlike traditional PDF converter websites, your documents are never uploaded to the cloud or third-party servers.'
      }
    ],
    'image-dimensions-size': [
      {
        question: 'How do I resize an image to 20 KB and specific dimensions (e.g. 3.5cm x 4.5cm)?',
        answer: 'Choose whether you want to resize by centimeters (with custom DPI) or pixels, enter your target dimensions (such as 3.5cm x 4.5cm for passport photos), enter 20 KB as your target file size, and click process. The tool generates an image that meets both constraints.'
      },
      {
        question: 'What DPI should I use for government and passport photos?',
        answer: '300 DPI is the standard requirement for print and official passport/visa submissions. At 3.5cm x 4.5cm and 300 DPI, your output will be approximately 413 x 531 pixels.'
      }
    ],
    'image-compressor': [
      {
        question: 'How do I compress an image without losing visible quality?',
        answer: 'Adjust the quality slider (80-85% is the sweet spot that reduces 60-80% of file size with no perceptible difference in visual clarity), or check "Compress to a target size" to reach an exact file size.'
      }
    ]
  };

  const custom = specificFaqs[tool.slug] || [
    {
      question: 'How do I use ' + tool.name + '?',
      answer: tool.description + ' Open the workspace, add your input, choose your settings, and download or copy the result. Everything runs private and fast right in your browser.'
    }
  ];

  return [
    ...custom,
    ...commonFaq.slice(0, 3),
    ...(tool.note ? [{ question: 'What should I know before I start?', answer: tool.note }] : []),
  ];
}

export function metadata(path: string) {
  const tool = tools.find(t => '/' + t.slug === path);
  const names: Record<string, string> = {
    '/all-tools': 'All Free Online Tools',
    '/about': 'About',
    '/privacy': 'Privacy Policy',
    '/terms': 'Terms of Use',
    '/contact': 'Contact'
  };

  const title = tool
    ? (tool.seoTitle || (tool.heading ? tool.heading : tool.name + ' Online Free')) + ' | ' + site.name
    : path === '/'
    ? site.name + ' — Free Online Tools for Everything (PDF, Image, Text, Dev)'
    : (names[path] || 'Page Not Found') + ' | ' + site.name;

  const description = tool
    ? tool.description + ' 100% free, fast, private, and easy to use. No signup, no limits, no watermark. Process files locally in your browser.'
    : 'Free PDF, image, text and developer tools. Fast, private, and easy to use. No signup, no watermark. Files stay on your device.';

  const keywords = tool
    ? tool.keywords.join(', ') + ', free online tools, ' + site.name
    : 'free online tools, pdf merger, compress image to 10kb, image resize to 20kb, json formatter, qr code generator, client side tools';

  return {
    title,
    description,
    keywords,
    url: site.origin.replace(/\/$/, '') + (path === '/' ? '' : path),
    tool
  };
}

export function schemas(path: string) {
  const { tool, url, description } = metadata(path);
  const app = {
    '@context': 'https://schema.org',
    '@type': tool ? 'WebApplication' : 'WebSite',
    name: tool ? (tool.heading || tool.name) : site.name,
    url,
    description,
    ...(tool
      ? {
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any',
          browserRequirements: 'Requires a modern browser with JavaScript',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          }
        }
      : {})
  };

  const faq = tool ? toolFaq(tool) : path === '/' ? commonFaq : [];
  return [
    app,
    ...(faq.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map(item => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
              }
            }))
          }
        ]
      : [])
  ];
}
