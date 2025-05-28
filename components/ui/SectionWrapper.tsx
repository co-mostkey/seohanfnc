import React from 'react';

// SectionWrapper provides uniform background, padding, rounding, and shadow based on variant
export type SectionVariant = 'neutral' | 'primary' | 'secondary' | 'hero';

export interface SectionWrapperProps {
  variant?: SectionVariant;
  className?: string;
  children: React.ReactNode;
}

export function SectionWrapper({ variant = 'neutral', className = '', children }: SectionWrapperProps) {
  const bgClasses = {
    neutral: 'bg-neutral-50 dark:bg-neutral-800',
    primary: 'bg-primary/10 dark:bg-primary/20',
    secondary: 'bg-secondary/10 dark:bg-secondary/20',
    hero: 'bg-transparent',
  }[variant];

  return (
    <section className={`${bgClasses} rounded-lg p-6 shadow-sm ${className}`}>
      {children}
    </section>
  );
} 