import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  title: string;
  description: string;
  date: string;
  lastmod?: string;
  author?: string;
  image?: string;
  url?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

/**
 * BlogPosting 结构化数据
 * 用于 Google 富媒体搜索结果
 */
export function StructuredData({
  title,
  description,
  date,
  lastmod,
  author,
  image,
  url,
}: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    datePublished: date,
    dateModified: lastmod || date,
    author: author
      ? {
          '@type': 'Person',
          name: author,
        }
      : undefined,
    image: image
      ? {
          '@type': 'ImageObject',
          url: image,
        }
      : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url || window.location.href,
    },
    publisher: {
      '@type': 'Organization',
      name: import.meta.env.VITE_SITE_TITLE || 'Blog',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(structuredData, null, 2)}</script>
    </Helmet>
  );
}

/**
 * BreadcrumbList 结构化数据
 * 用于面包屑导航 SEO
 */
export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(structuredData, null, 2)}</script>
    </Helmet>
  );
}
