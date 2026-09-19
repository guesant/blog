import { BrandIcon, isBrandName } from './brand-icon';
import { BrandMonogram } from './brand-monogram';

type BrandGlyphProps = {
  label: string;
  logo?: string;
  size?: number;
};

export function BrandGlyph(brandGlyphProps: BrandGlyphProps) {
  const { label, logo, size } = brandGlyphProps;

  if (isBrandName(logo)) {
    return <BrandIcon name={logo} size={size} />;
  }

  return <BrandMonogram label={label} size={size} />;
}
