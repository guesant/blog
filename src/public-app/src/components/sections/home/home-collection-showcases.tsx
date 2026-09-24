import type { HomeCollectionShowcase as HomeCollectionShowcaseData } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { HomeCollectionShowcase } from './home-collection-showcase';

type HomeCollectionShowcasesProps = {
  showcases: HomeCollectionShowcaseData[];
  t: Translator;
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
