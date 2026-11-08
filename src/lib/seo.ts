import { site } from '../config/site';
import { commonFaq, tools, type Tool } from '../config/tools';

export function toolFaq(tool: Tool) {
  const specificFaqs: Record<string, { question: string; answer: string }[]> = {
    'image-target-size': [
      {
        question: 'Can I compress an image to exact file sizes like 10 KB, 20 KB or 50 KB?',
        answer: 'Enter a size in KB or MB. The tool adjusts quality and pixel dimensions to try to stay at or below the target. If it cannot reach the target, it shows the smallest output it found.'
      },
      {
        question: 'How do I compress an image to 10 KB online for free?',
        answer: 'Choose a JPG, PNG, or WebP file, set the target to 10 KB, and run the tool. Check the size and preview before downloading.'
      },
      {
        question: 'Will my image be watermarked or uploaded anywhere?',
        answer: 'Your browser processes the photo on your device. The website adds no watermark.'
      }
    ],
    'pdf-merge': [
      {
        question: 'How do I merge multiple PDF files online for free?',
        answer: 'Add at least two PDFs. Drag them into order or use the arrow buttons, then select Merge PDF and download the result.'
      },
      {
        question: 'Is there a limit on how many PDFs I can combine?',
        answer: 'Your device memory determines how many PDFs you can merge at once. If a large batch fails, try merging fewer files at a time.'
      },
      {
        question: 'Are my private PDF documents secure?',
        answer: 'Your browser merges the PDFs on your device. The website does not upload your documents.'
      }
    ],
    'image-dimensions-size': [
      {
        question: 'How do I resize an image to 20 KB and specific dimensions (e.g. 3.5cm x 4.5cm)?',
        answer: 'Set the dimensions, enable the file size target, and enter 20 KB. The tool keeps the dimensions fixed and tells you if the smallest output still exceeds the target.'
      },
      {
        question: 'What DPI should I use for government and passport photos?',
        answer: 'Use the dimensions and DPI specified on your form. For example, 3.5 × 4.5 cm at 300 DPI comes to about 413 × 531 pixels.'
      }
    ],
    'image-compressor': [
      {
        question: 'How do I compress an image without losing visible quality?',
        answer: 'Start with a higher quality setting and compare the previews. The size and detail you keep depend on the source image and output format.'
      }
    ]
  };

  const custom = specificFaqs[tool.slug] || [
    {
      question: 'How do I use ' + tool.name + '?',
      answer: 'Add your input, choose your settings, then download or copy the result.'
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
    ? tool.description + ' Free to use in your browser. No signup or uploads.'
    : 'Free tools for PDFs, images, text, and code. Merge files, resize photos, format JSON, and more. Your browser processes files on your device.';

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
