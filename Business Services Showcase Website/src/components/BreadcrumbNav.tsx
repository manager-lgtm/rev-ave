import React from 'react';
import { ChevronRight } from 'lucide-react';

export function BreadcrumbNav({ breadcrumbs }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          {crumb.current ? (
            <span className="text-gray-900 font-medium">{crumb.label}</span>
          ) : (
            <button
              onClick={crumb.onClick}
              className="hover:text-blue-600 transition-colors"
            >
              {crumb.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}