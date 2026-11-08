// Change the brand in this one file. Build-time environment variables are public.
export const site = {
  name: 'ToolKitFree',
  tagline: 'Every tool you need. 100% free. No signup.',
  origin: processEnv('VITE_SITE_URL') || 'https://toolkitfree.online',
  contactEmail: processEnv('VITE_CONTACT_EMAIL') || '',
  supportUrl: processEnv('VITE_SUPPORT_URL') || '',
  adsEnabled: processEnv('VITE_ADS_ENABLED') === 'true',
  analyticsDomain: processEnv('VITE_PLAUSIBLE_DOMAIN') || '',
  analyticsScript: processEnv('VITE_PLAUSIBLE_SCRIPT') || 'https://plausible.io/js/script.manual.js',
};

function processEnv(name: string): string | undefined {
  return typeof process !== 'undefined' ? process.env[name] : import.meta.env?.[name];
}
