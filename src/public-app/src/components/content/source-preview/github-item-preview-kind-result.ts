type GithubItemPreviewKindResultProps = {
  hasRepository: boolean;
  itemType?: string;
};

export function githubItemPreviewKindResult(props: GithubItemPreviewKindResultProps) {
  if (props.hasRepository) {
    return 'repository' as const;
  }

  return ['organization', 'org'].includes(props.itemType ?? '') ? 'organization' : 'user';
}
