import { createProtectedEmailChallengeMutation } from '@portfolio/data/api/public-site-generated-client';
import { apiClient } from '@portfolio/data/api/public-site-source-api-client';
import { useMutation } from '@tanstack/react-query';

export function useEmailChallenge() {
  return useMutation(createProtectedEmailChallengeMutation({ client: apiClient() }));
}
