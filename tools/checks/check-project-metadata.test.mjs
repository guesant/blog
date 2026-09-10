import test from 'node:test';
import { checkProjectMetadata } from './check-project-metadata.mjs';

test('project metadata is complete and internally consistent', () => {
  checkProjectMetadata();
});
