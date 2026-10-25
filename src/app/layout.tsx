import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: {
    default: 'PT ZIA Properti Indonesia | Building Better Places, Creating Long Term Value',
    template: '%s | PT ZIA Properti Indonesia',
  },
  description:
    'PT ZIA Properti Indonesia mengembangkan proyek hunian dan ekosistem bisnis di Kabupaten Bekasi, Jawa Barat, termasuk ZIA Emerald, Kav Hillside, ZIA Farm, dan Altara ZIA International.',
  openGraph: {
    title: 'PT ZIA Properti Indonesia',
    description:
      'Website resmi PT ZIA Properti Indonesia dan portofolio proyeknya.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'PT ZIA Properti Indonesia',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PT ZIA Properti Indonesia',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-stone-50 text-stone-900 antialiased selection:bg-stone-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
