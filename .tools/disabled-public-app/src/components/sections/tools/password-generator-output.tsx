import { PasswordResult } from './password-result';

type PasswordGeneratorOutputProps = {
  value: string;
  bits: number;
  copied: boolean;
  labels: (key: string) => string;
  onCopy: () => void;
};

export function PasswordGeneratorOutput(props: PasswordGeneratorOutputProps) {
  return (
    <PasswordResult
      value={props.value}
      bits={props.bits}
      passwordLabel={props.labels('password')}
      entropyLabel={props.labels('estimatedEntropy')}
      copyLabel={props.copied ? props.labels('copied') : props.labels('copy')}
      onCopy={props.onCopy}
    />
  );
}
