import { RecordValue, ContentCollection, Snapshot } from './public-site-source-support';

export function itemsFor(snapshot: Snapshot, collection: ContentCollection): RecordValue[] {
  return {
    cases: snapshot.cases,
    projects: snapshot.projects,
    experiments: snapshot.experiments,
    writing: snapshot.writings,
    references: snapshot.findings,
    collections: snapshot.collections,
    topics: snapshot.topics,
  }[collection];
}
