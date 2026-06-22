import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the universal `locale` in `next.config.js`
  const locale = await requestLocale;

  return {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    messages: (await import(`./messages/${locale || 'en'}.json`)).default
  };
});
