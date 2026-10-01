import type { LicenseSectionProps } from './types';
import { LicenseBodyText } from '../../ui/semantic/LicenseBodyText';
import { LicenseSectionFrame } from '../../ui/semantic/LicenseSectionFrame';
import { LicenseSectionText } from '../../ui/semantic/LicenseSectionText';

export function LicenseSection(props: LicenseSectionProps) {
  const { heading, body } = props;

  return (
    <LicenseSectionFrame component="section">
      <LicenseSectionText component="h2" variant="h5">
        {heading}
      </LicenseSectionText>
      <LicenseBodyText color="text.secondary">{body}</LicenseBodyText>
    </LicenseSectionFrame>
  );
}
