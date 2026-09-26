type CreateArchitectureLineOptions = {
  y1: string;
  y2: string;
};

export function createArchitectureLine(options: CreateArchitectureLineOptions) {
  return {
    component: 'line',
    x1: '200',
    y1: options.y1,
    x2: '200',
    y2: options.y2,
    stroke: '@accent.line',
    strokeWidth: '1.5',
  };
}
