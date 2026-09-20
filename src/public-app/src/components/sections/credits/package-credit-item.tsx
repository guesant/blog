import { Box, Link, Typography } from '../../ui';
import type { PackageCredit } from '@portfolio/data/domain/types';
import { ConditionalContent } from '../../primitives/conditional-content';
import { PackageCreditMetadata } from './package-credit-metadata';

type PackageCreditItemProps = { pkg: PackageCredit };

export function PackageCreditItem(props: PackageCreditItemProps) {
  const { pkg } = props;

  return (
    <Box>
      <Box visualVariant="packageCreditItem">
        <Link
          href={`https://www.npmjs.com/package/${pkg.name}`}
          target="_blank"
          rel="noopener noreferrer"
          visualVariant="packageCreditItem"
        >
          {pkg.name}
        </Link>
        <Typography component="span" variant="body2" color="text.disabled">
          {pkg.version}
        </Typography>
      </Box>
      <ConditionalContent
        condition={Boolean(pkg.description)}
        content={
          <Typography variant="body2" color="text.secondary" visualVariant="packageCreditItem">
            {pkg.description}
          </Typography>
        }
      />
      <PackageCreditMetadata pkg={pkg} />
    </Box>
  );
}
