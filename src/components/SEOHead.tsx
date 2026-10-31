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
  const normalizeCorporateName = (value: string) =>
    value.replace(/\bPT\s+ZIA\s+PROPERTI\s+INDONESIA\b/gi, companyName)
      .replace(/\bZIA\s+PROPERTI\s+INDONESIA\b/gi, companyName);

  const normalizedTitle = title ? normalizeCorporateName(title) : '';
  const finalTitle = normalizedTitle
    ? `${normalizedTitle} | ${companyName}`
    : `${companyName} | Building Better Places, Creating Long Term Value`;

  const finalDesc = normalizeCorporateName(
    description ||
    project?.seoDescription ||
    project?.shortDescription ||
    'ZIA Corporate - Ekosistem bisnis lintas sektor yang menghadirkan ZIA Emerald, Kav Hillside, ZIA Farm, Altara ZIA International, ZIA Raya, dan ZIA Direct.'
  );

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
    const canonicalUrl = canonicalPath
      ? new URL(canonicalPath, window.location.origin).toString()
      : window.location.href.split(/[?#]/)[0];

    setMeta('property', 'og:url', canonicalUrl);
    setMeta('name', 'twitter:title', finalTitle);
    setMeta('name', 'twitter:description', finalDesc);

    // Keep a canonical link aligned with the current public route. This is
    // client-side metadata for the current SPA; prerender/SSR is a separate
    // SEO improvement and is not implied by this update.
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // 3. Schema.org JSON-LD structured data.
    // ZIA Corporate is a multi-sector business ecosystem, not a single
    // real-estate-agent listing. Do not invent a price or availability offer.
    let scriptTag = document.getElementById('schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const organizationId = `${window.location.origin}/#organization`;
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': organizationId,
          'name': companyName,
          'url': window.location.origin,
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
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          'url': canonicalUrl,
          'name': finalTitle,
          'description': finalDesc,
          'about': project
            ? {
                '@type': 'Thing',
                'name': project.name,
                ...(project.shortDescription ? { 'description': project.shortDescription } : {}),
                ...(project.heroImage ? { 'image': project.heroImage } : {})
              }
            : { '@id': organizationId },
          'isPartOf': {
            '@type': 'WebSite',
            '@id': `${window.location.origin}/#website`,
            'name': companyName,
            'url': window.location.origin
          }
        }
      ]
    };

    scriptTag.text = JSON.stringify(structuredData);
  }, [finalTitle, finalDesc, finalImage, canonicalPath, project, settings]);

  return null;
};
