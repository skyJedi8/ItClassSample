import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyContactBar from '@/components/StickyContactBar';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Operation Clean Freedom',
  description: siteConfig.tagline,
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Header />{children}<Footer/><StickyContactBar/>{siteConfig.gtmId && <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${siteConfig.gtmId}');`}</Script>}</body></html>;
}
