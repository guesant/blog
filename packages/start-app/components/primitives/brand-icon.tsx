import type { CSSProperties } from 'react';
import {
  type SimpleIcon,
  siBluesky,
  siBootstrap,
  siBun,
  siCss,
  siDocker,
  siDotnet,
  siGit,
  siGithub,
  siGithubactions,
  siGitlab,
  siGnu,
  siGnubash,
  siGo,
  siGooglescholar,
  siGraphql,
  siHelm,
  siHtml5,
  siInstagram,
  siJavascript,
  siK3s,
  siKubernetes,
  siLinux,
  siMacos,
  siMastodon,
  siNativescript,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siNx,
  siOpenapiinitiative,
  siOrcid,
  siPfsense,
  siPhp,
  siPnpm,
  siPortainer,
  siPostgresql,
  siPrisma,
  siProxmox,
  siPuppeteer,
  siReact,
  siRedux,
  siResearchgate,
  siSqlite,
  siTypescript,
  siVim,
  siVitest,
  siVuedotjs,
  siWebstorm,
  siWordpress,
  siYii,
} from 'simple-icons';

export type BrandName =
  | 'bluesky'
  | 'bootstrap'
  | 'bun'
  | 'css'
  | 'docker'
  | 'dotnet'
  | 'git'
  | 'github'
  | 'githubactions'
  | 'gitlab'
  | 'gnu'
  | 'gnubash'
  | 'go'
  | 'googlescholar'
  | 'graphql'
  | 'helm'
  | 'html5'
  | 'instagram'
  | 'javascript'
  | 'k3s'
  | 'kubernetes'
  | 'linux'
  | 'macos'
  | 'mastodon'
  | 'nativescript'
  | 'nestjs'
  | 'nextdotjs'
  | 'nodedotjs'
  | 'npm'
  | 'nx'
  | 'openapiinitiative'
  | 'orcid'
  | 'pfsense'
  | 'php'
  | 'pnpm'
  | 'portainer'
  | 'postgresql'
  | 'prisma'
  | 'proxmox'
  | 'puppeteer'
  | 'react'
  | 'redux'
  | 'researchgate'
  | 'sqlite'
  | 'typescript'
  | 'vim'
  | 'vitest'
  | 'vuedotjs'
  | 'webstorm'
  | 'wordpress'
  | 'yii';

const brands: Record<BrandName, SimpleIcon> = {
  bluesky: siBluesky,
  bootstrap: siBootstrap,
  bun: siBun,
  css: siCss,
  docker: siDocker,
  dotnet: siDotnet,
  git: siGit,
  github: siGithub,
  githubactions: siGithubactions,
  gitlab: siGitlab,
  gnu: siGnu,
  gnubash: siGnubash,
  go: siGo,
  googlescholar: siGooglescholar,
  graphql: siGraphql,
  helm: siHelm,
  html5: siHtml5,
  instagram: siInstagram,
  javascript: siJavascript,
  k3s: siK3s,
  kubernetes: siKubernetes,
  linux: siLinux,
  macos: siMacos,
  mastodon: siMastodon,
  nativescript: siNativescript,
  nestjs: siNestjs,
  nextdotjs: siNextdotjs,
  nodedotjs: siNodedotjs,
  npm: siNpm,
  nx: siNx,
  openapiinitiative: siOpenapiinitiative,
  orcid: siOrcid,
  pfsense: siPfsense,
  php: siPhp,
  pnpm: siPnpm,
  portainer: siPortainer,
  postgresql: siPostgresql,
  prisma: siPrisma,
  proxmox: siProxmox,
  puppeteer: siPuppeteer,
  react: siReact,
  redux: siRedux,
  researchgate: siResearchgate,
  sqlite: siSqlite,
  typescript: siTypescript,
  vim: siVim,
  vitest: siVitest,
  vuedotjs: siVuedotjs,
  webstorm: siWebstorm,
  wordpress: siWordpress,
  yii: siYii,
};

export function isBrandName(value: string | undefined): value is BrandName {
  return value !== undefined && Object.hasOwn(brands, value);
}

type BrandIconProps = {
  name: BrandName;
  size?: number;
  useBrandColor?: boolean;
  style?: CSSProperties;
};

export function BrandIcon(brandIconProps: BrandIconProps) {
  const { name, size = 20, useBrandColor = false, style } = brandIconProps;
  const icon = brands[name];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={useBrandColor ? `#${icon.hex}` : 'currentColor'}
      style={{ display: 'block', flex: '0 0 auto', ...style }}
    >
      <path d={icon.path} />
    </svg>
  );
}
