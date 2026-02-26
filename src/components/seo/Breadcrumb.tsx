import React from 'react';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  homeLabel?: string;
}

/**
 * 面包屑导航组件
 * 包含 UI 和结构化数据
 */
export function Breadcrumb({ items, homeLabel = '首页' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        <li>
          <a
            href="/"
            className="hover:text-foreground transition-colors"
            aria-label={homeLabel}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </a>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground/50"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {item.url && index < items.length - 1 ? (
              <a
                href={item.url}
                className="hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
            ) : (
              <span className="text-foreground font-medium">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
