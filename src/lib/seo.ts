import { site } from '../config/site';
import { categories, commonFaq, tools, type CategoryId, type Tool } from '../config/tools';
import { toolGuides } from '../config/tool-guides';

const pages: Record<string, { title: string; description: string } | undefined> = {
  '/': {
    title: 'Free PDF, Image & Developer Tools',
    description: 'Merge PDFs, compress photos to a file size limit, format JSON, and make QR codes for free. Tools run in your browser without uploads or signups.',
  },
  '/all-tools': {
    title: 'Browse Free PDF, Image, Text & Developer Tools',
    description: 'Search and filter free tools for PDF editing, photo resizing, text cleanup, code formatting, QR codes, and everyday calculations.',
  },
  '/about': {
    title: 'About',
    description: 'Learn how ' + site.name + ' offers free PDF, image, text, and developer tools while keeping your files and inputs on your device.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'Learn how ' + site.name + ' handles local file processing, browser storage, analytics, and the information your browser sends to the host.',
  },
  '/terms': {
    title: 'Terms of Use',
    description: 'Read the terms for using the free PDF, image, text, and developer tools, including practical limits and responsibilities for your files.',
  },
  '/contact': {
    title: 'Contact',
    description: 'Report a bug or suggest a tool for ' + site.name + '. Describe the tool and browser so the issue can be reproduced.',
  },
};

export function normalizePagePath(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/';
}

export function categoryPath(category: CategoryId) {
  return '/all-tools/?category=' + category;
}

function pageUrl(path: string) {
  return site.origin.replace(/\/+$/, '') + (path === '/' ? '/' : path + '/');
}

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

export function metadata(pathname: string) {
  const path = normalizePagePath(pathname);
  const tool = tools.find(tool => '/' + tool.slug === path);
  const page = pages[path];
  const title = tool
    ? tool.seoTitle ?? tool.heading ?? tool.name + ' Online Free'
    : page?.title ?? 'Page Not Found';
  const description = tool
    ? toolGuides[tool.slug]?.description ?? tool.description + ' Free to use in your browser with no signup.'
    : page?.description ?? 'Find the PDF, image, text, or developer tool you were looking for in the tool directory.';

  return {
    title: title + ' | ' + site.name,
    description,
    url: tool || page ? pageUrl(path) : undefined,
    tool,
  };
}

export function schemas(pathname: string) {
  const { tool, url, description } = metadata(pathname);
  if (!url) return [];
  if (normalizePagePath(pathname) === '/') {
    return [{ '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url, description }];
  }
  if (!tool) return [];

  const category = categories.find(category => category.id === tool.category)!;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: toolGuides[tool.slug]?.heading ?? tool.name,
      url,
      description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires a modern browser with JavaScript',
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: pageUrl('/') },
        { '@type': 'ListItem', position: 2, name: category.name, item: new URL(categoryPath(category.id), url).href },
        { '@type': 'ListItem', position: 3, name: tool.name, item: url },
      ],
    },
  ];
}
