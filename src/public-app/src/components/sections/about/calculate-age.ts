export function calculateAge(birthDateISO: string): number | undefined {
  const birthDate = new Date(birthDateISO);

  if (Number.isNaN(birthDate.getTime())) {
    return undefined;
  }

  const now = new Date();

  let age = now.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }
  return age;
}
