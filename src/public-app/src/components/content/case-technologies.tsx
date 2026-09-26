import type { CaseStudy } from '@portfolio/data/domain/types';
import { Typography } from '../ui';

type CaseTechnologiesProps = {
  item: CaseStudy;
  visualVariant?: string;
};

export function CaseTechnologies(props: CaseTechnologiesProps) {
  return (
    <Typography visualVariant={props.visualVariant}>
      {props.item.technologies.join(' · ')}
    </Typography>
  );
}
