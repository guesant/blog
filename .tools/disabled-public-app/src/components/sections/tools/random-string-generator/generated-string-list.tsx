import { Stack } from '../../../ui';
import { GeneratedString } from './generated-string';

type GeneratedStringListProps = { results: string[] };

export function GeneratedStringList(props: GeneratedStringListProps) {
  return (
    <Stack spacing={1} visualVariant="generatedStringList">
      {props.results.map((value, index) => (
        <GeneratedString key={index} value={value} />
      ))}
    </Stack>
  );
}
