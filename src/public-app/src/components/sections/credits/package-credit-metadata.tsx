import { Box, Link, Typography } from '../../ui';
import type { PackageCredit } from '@portfolio/data/domain/types';
import { ConditionalContent } from '../../primitives/conditional-content';

type PackageCreditMetadataProps = {
  pkg: PackageCredit;
};

export function PackageCreditMetadata(props: PackageCreditMetadataProps) {
  return (
    <Typography variant="body2" color="text.disabled" visualVariant="packageCreditItem2">
      <ConditionalContent
        condition={Boolean(props.pkg.license)}
        content={<Box component="span">{props.pkg.license}</Box>}
      />
      <ConditionalContent
        condition={Boolean(props.pkg.author)}
        content={<Box component="span">© {props.pkg.author}</Box>}
      />
      <ConditionalContent
        condition={Boolean(props.pkg.repositoryUrl)}
        content={
          <Link href={props.pkg.repositoryUrl ?? '#'} target="_blank" rel="noopener noreferrer">
            repo
          </Link>
        }
      />
    </Typography>
  );
}
