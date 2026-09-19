export type GenerateCommandOptions = {
  outputPath: string;
};

export function parseGenerateCommandOptions(args: string[]): GenerateCommandOptions {
  const options = args[0] === '--' ? args.slice(1) : args;
  if (options.length !== 2 || options[0] !== '--output' || !options[1]?.trim()) {
    throw new Error('Usage: pnpm generate -- --output <path>');
  }

  return { outputPath: options[1] };
}
