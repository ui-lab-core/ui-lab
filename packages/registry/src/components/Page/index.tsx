import React from 'react';
import { ComponentDetail } from '@/types';

export const pageDetail: ComponentDetail = {
  id: 'page',
  name: 'Page',
  description: 'A lightweight page container with Header, Body, and Footer regions plus a built-in SEO helper.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Page component serves as the top-level page wrapper, composed of{' '}
        <code>Page.Header</code>, <code>Page.Body</code>, and <code>Page.Footer</code>. It provides
        max-width constraints and padding control as the root wrapper for any page in your application.
      </p>
      <p>
        Pass a <code>seo</code> prop with <code>title</code>, <code>description</code>, and{' '}
        <code>canonical</code> to render document metadata tags directly from the page.
      </p>
    </div>
  ),
  examples: [],
};
