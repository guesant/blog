export function metadataResumeTarget(pathname: string, laravelBase: string): string | null {
  const resumeMatch = pathname.match(/^\/resume-(en|pt-BR)\.pdf$/);

  return resumeMatch ? `${laravelBase}/api/v1/resume/${resumeMatch[1]}.pdf` : null;
}
