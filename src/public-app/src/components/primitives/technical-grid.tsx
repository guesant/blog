'use client';

import { TechnicalGridSurface } from '../ui';
import { useRef } from 'react';
import { useGridPointer } from './use-grid-pointer';

type TechnicalGridProps = { variant?: 'hero' | 'panel' };

export function TechnicalGrid(props: TechnicalGridProps) {
  const { variant = 'hero' } = props;

  const isPanel = variant === 'panel';

  const gridRef = useRef<HTMLDivElement>(null);

  useGridPointer(gridRef, isPanel);

  return <TechnicalGridSurface ref={gridRef} panel={isPanel} />;
}
