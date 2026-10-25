import type { Metadata } from 'next';
import { siteConfig } from './site';

export function getMetadata(title: string, description: string, path = ''): Metadata {
  const url = `${siteConfig.baseUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: 'website',
      images: [{url:'/images/holiday/social.jpg',width:1200,height:630,alt:'Operation Clean Freedom Christmas lighting'}]
    }
  };
}
