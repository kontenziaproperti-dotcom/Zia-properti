import React, { useEffect } from 'react';
import { CompanySettings, ProjectEntity } from '../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  project?: ProjectEntity | null;
  settings?: CompanySettings;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  image,
  project,
  settings
}) => {
  // CMS data may still carry the former entity name. Public SEO must use the
  // approved corporate master brand until that record is migrated.
  const companyName = 'ZIA Corporate';
  const finalTitle = title
    ? `${title} | ${companyName}`
    : `${companyName} | Building Better Places, Creating Long Term Value`;

  const finalDesc =
    description ||
    project?.seoDescription ||
    project?.shortDescription ||
    'ZIA Corporate - Ekosistem bisnis lintas sektor yang menghadirkan ZIA Emerald, Kav Hillside, ZIA Farm, Altara ZIA International, ZIA Raya, dan ZIA Direct.';

  // Do not inject stock imagery into corporate metadata. A verified corporate
  // image can be supplied through the image prop or migrated CMS project data.
  const finalImage = image || project?.heroImage || '';

  useEffect(() => {
    // 1. Update Document Title
    document.title = finalTitle;

    // 2. Helper to set or create meta tags
    const setMeta = (nameAttr: string, nameValue: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${nameValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, nameValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('name', 'description', finalDesc);
    setMeta('property', 'og:title', finalTitle);
    setMeta('property', 'og:description', finalDesc);
    if (finalImage) {
      setMeta('property', 'og:image', finalImage);
      setMeta('name', 'twitter:image', finalImage);
    } else {
      document.querySelector('meta[property="og:image"]')?.remove();
      document.querySelector('meta[name="twitter:image"]')?.remove();
    }
    setMeta('property', 'og:type', project ? 'product' : 'website');
    setMeta('property', 'og:url', window.location.href);
    setMeta('name', 'twitter:title', finalTitle);
    setMeta('name', 'twitter:description', finalDesc);

    // 3. Schema.org JSON-LD structured data
    let scriptTag = document.getElementById('schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'RealEstateAgent',
          '@id': 'https://ziaproperti.co.id/#organization',
          'name': companyName,
          'url': 'https://ziaproperti.co.id',
          'logo': 'https://ziaproperti.co.id/logo.png',
          'description': finalDesc,
          ...(settings?.phone ? { 'telephone': settings.phone } : {}),
          ...(settings?.fullAddress?.trim()
            ? {
                'address': {
                  '@type': 'PostalAddress',
                  'streetAddress': settings.fullAddress,
                  'addressCountry': 'ID'
                }
              }
            : {})
        },
        project ? {
          '@type': 'Product',
          'name': project.name,
          'description': project.shortDescription,
          'image': project.heroImage,
          'brand': {
            '@type': 'Brand',
            'name': companyName
          },
          'offers': {
            '@type': 'Offer',
            'availability': 'https://schema.org/InStock',
            'priceCurrency': 'IDR',
            'price': '0',
            'seller': {
              '@type': 'Organization',
              'name': companyName
            }
          }
        } : null
      ].filter(Boolean)
    };

    scriptTag.text = JSON.stringify(structuredData);
  }, [finalTitle, finalDesc, finalImage, canonicalPath, project, settings]);

  return null;
};
