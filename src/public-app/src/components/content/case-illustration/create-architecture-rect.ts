type CreateArchitectureRectOptions = {
  fill: string;
  height: string;
  width: string;
  x: string;
  y: string;
};

export function createArchitectureRect(options: CreateArchitectureRectOptions) {
  return {
    component: 'rect',
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    rx: '10',
    fill: options.fill,
    stroke: '@accent.line',
  };
}
