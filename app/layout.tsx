import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyContactBar from '@/components/StickyContactBar';
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
  return <html lang="en"><body className="overflow-x-hidden"><Header />{children}<Footer/><StickyContactBar/>{siteConfig.gtmId && <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${siteConfig.gtmId}');`}</Script>}</body></html>;
}
