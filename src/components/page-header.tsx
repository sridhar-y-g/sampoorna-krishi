import type { FC, ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="flex items-start gap-4 mb-8">
      {children}
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-lg text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};
