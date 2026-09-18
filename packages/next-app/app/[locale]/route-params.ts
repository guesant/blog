import type { ReactNode } from 'react';

type LocaleParams = Promise<{ locale: string }>;
type SlugParams = Promise<{ locale: string; slug: string }>;
type TypeParams = Promise<{ locale: string; type: string }>;

export type LocaleRouteProps = { params: LocaleParams };
export type SlugRouteProps = { params: SlugParams };
export type TypeRouteProps = { params: TypeParams };
export type LocaleLayoutProps = Readonly<{ children: ReactNode; params: LocaleParams }>;
export type RouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
