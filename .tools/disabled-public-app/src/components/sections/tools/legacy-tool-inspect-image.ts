import { readFileAsDataUrl } from './legacy-tool-read-file-as-data-url';

export async function inspectImage(file: File, slug: string) {
  if (slug === 'image-to-base64') return readFileAsDataUrl(file);

  const url = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();

      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('image'));
      element.src = url;
    });

    if (slug === 'image-dimension-calculator')
      return `${image.naturalWidth} × ${image.naturalHeight}`;

    const canvas = document.createElement('canvas');

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext('2d');

    if (!context) return file.name;
    context.drawImage(image, 0, 0);
    if (slug === 'image-color-picker') {
      const pixel = context.getImageData(
        Math.floor(canvas.width / 2),
        Math.floor(canvas.height / 2),
        1,
        1,
      ).data;

      return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    }

    const mime =
      slug === 'image-format-converter' || slug === 'svg-to-png'
        ? 'image/png'
        : file.type || 'image/jpeg';

    const quality = slug === 'image-compressor' ? 0.75 : 0.9;

    const result = canvas.toDataURL(mime, quality);

    return `${result.slice(0, 96)}…\n${image.naturalWidth} × ${image.naturalHeight}`;
  } finally {
    URL.revokeObjectURL(url);
  }
}
