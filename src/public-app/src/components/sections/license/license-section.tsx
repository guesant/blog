import type { LicenseSectionProps } from './types';
import { LicenseSection2Text } from '../../ui/semantic/LicenseSection2Text';
import { LicenseSectionFrame } from '../../ui/semantic/LicenseSectionFrame';
import { LicenseSectionText } from '../../ui/semantic/LicenseSectionText';

export function LicenseSection(props: LicenseSectionProps) {
  const { heading, body } = props;

  return (
    <LicenseSectionFrame component="section">
      <LicenseSectionText component="h2" variant="h5">
        {heading}
      </LicenseSectionText>
      <LicenseSection2Text color="text.secondary">{body}</LicenseSection2Text>
    </LicenseSectionFrame>
  );
}
