import { Box } from '../../ui';
import type { PackageListProps } from './types';
import { PackageCreditItem } from './package-credit-item';

export function PackageList(props: PackageListProps) {
  const { packages } = props;

  return (
    <Box visualVariant="packageList">
      {packages.map((pkg) => (
        <PackageCreditItem key={pkg.name} pkg={pkg} />
      ))}
    </Box>
  );
}
