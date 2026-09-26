import type { HomeCollectionShowcase as HomeCollectionShowcaseData } from '@portfolio/data/domain/types';
import type { HomeTranslator } from '@/i18n/compat-support';
import { HomeCollectionShowcase } from './home-collection-showcase';

type HomeCollectionShowcasesProps = {
  showcases: HomeCollectionShowcaseData[];
  t: HomeTranslator;
};

export function HomeCollectionShowcases(props: HomeCollectionShowcasesProps) {
  return (
    <>
      {props.showcases.map((showcase) => (
        <HomeCollectionShowcase key={showcase.collection.slug} showcase={showcase} t={props.t} />
      ))}
    </>
  );
}
