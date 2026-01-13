import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async () => {
  // Get locale from cookie or default to Spanish
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale')?.value;
  const locale = localeCookie || 'es';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
