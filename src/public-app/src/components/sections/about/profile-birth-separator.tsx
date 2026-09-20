type ProfileBirthSeparatorProps = {
  hasAge: boolean;
  hasCity: boolean;
};

export function ProfileBirthSeparator(props: ProfileBirthSeparatorProps) {
  if (!props.hasAge || !props.hasCity) {
    return null;
  }

  return <> · </>;
}
