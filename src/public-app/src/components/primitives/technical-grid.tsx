import { PanelTechnicalGrid } from './panel-technical-grid';
import { HeroTechnicalGrid } from './hero-technical-grid';

export type TechnicalGridProps = { variant?: 'hero' | 'panel' };

export function TechnicalGrid(props: TechnicalGridProps) {
  if (props.variant === 'panel') {
    return <PanelTechnicalGrid />;
  }

  return <HeroTechnicalGrid />;
}
