import { ReactNode } from 'react';

export interface MarkdownComponentProps {
  node: {
    type: string;
    tagName: string;
    properties: Record<string, any>;
    children: any[];
  };
  children: ReactNode;
  [key: string]: any;
}
