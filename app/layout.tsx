import './globals.css';
import type { Metadata } from 'next';
import PublicChrome from '@/components/PublicChrome';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: 'Operation Clean Freedom | Veteran-Owned Exterior Cleaning',
    template: '%s'
  },
  description: siteConfig.tagline,
  verification: {
    google: 'FJx5D17tKISU38eJSBGObEG-SDcZA8-IXflshgsGl8M'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Operation Clean Freedom',
    title: 'Operation Clean Freedom | Veteran-Owned Exterior Cleaning',
    description: 'Veteran-owned pressure washing, gutter cleaning, roof soft washing, and drainage service across Greater Houston.'
  },
  twitter: {
    card: 'summary',
    title: 'Operation Clean Freedom',
    description: siteConfig.tagline
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="overflow-x-hidden"><PublicChrome>{children}</PublicChrome></body></html>;
}
