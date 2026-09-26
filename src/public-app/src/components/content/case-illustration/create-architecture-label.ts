type CreateArchitectureLabelOptions = {
  fontSize: string;
  y: string;
};

export function createArchitectureLabel(options: CreateArchitectureLabelOptions) {
  return { x: '200', y: options.y, fontSize: options.fontSize, textAnchor: 'middle' };
}
