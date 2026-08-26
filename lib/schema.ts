import { siteConfig } from './site';

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': siteConfig.baseUrl + '/#business',
  name: siteConfig.name,
  description: siteConfig.tagline + ' Veteran-owned exterior cleaning serving Conroe, Spring, The Woodlands, and Greater Houston.',
  areaServed: ['Conroe', 'Spring', 'The Woodlands', 'Houston', 'Katy', 'Sugar Land'],
  telephone: siteConfig.phoneDisplay,
  email: siteConfig.email,
  url: siteConfig.baseUrl,
  image: siteConfig.baseUrl + '/ocf-logo.png.png',
  sameAs: [siteConfig.thumbtackUrl],
  openingHours: 'Mo-Fr 08:00-17:00',
  priceRange: '$$'
};

export function serviceSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    provider: {
      '@type': 'LocalBusiness',
      '@id': siteConfig.baseUrl + '/#business',
      name: siteConfig.name,
      url: siteConfig.baseUrl
    },
    areaServed: ['Conroe', 'Spring', 'The Woodlands', 'Greater Houston'],
    description,
    url: siteConfig.baseUrl + path
  };
}
