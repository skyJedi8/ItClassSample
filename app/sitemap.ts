import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

const paths=['','/services','/services/gutter-cleaning','/services/window-cleaning','/services/pressure-washing','/services/roof-cleaning','/services/drainage-cleaning','/service-areas','/service-areas/houston','/service-areas/katy','/service-areas/sugar-land','/service-areas/spring','/service-areas/the-woodlands','/commercial-hoa','/about','/gallery','/reviews','/contact','/faq','/privacy'];
export default function sitemap(): MetadataRoute.Sitemap { return paths.map((path)=>({url:`${siteConfig.baseUrl}${path}`,lastModified:new Date()})); }
