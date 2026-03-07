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
      type: 'website'
    }
  };
}
