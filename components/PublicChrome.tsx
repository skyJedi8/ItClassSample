'use client';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import Header from './Header';
import Footer from './Footer';
import StickyContactBar from './StickyContactBar';
import { siteConfig } from '@/lib/site';
export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path === '/staff' || path.startsWith('/staff/')) return <>{children}</>;
  return <><Header />{children}<Footer /><StickyContactBar />{siteConfig.gtmId && <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${siteConfig.gtmId}');`}</Script>}</>;
}
