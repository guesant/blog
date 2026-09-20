import { I18nContext, I18nProviderProps } from './compat-support';

export function I18nProvider(props: I18nProviderProps) {
  return <I18nContext.Provider value={props}>{props.children}</I18nContext.Provider>;
}
