import { api } from '@/lib/api';

interface UpdateProfilePayload {
  height: number;
  weight: number;
  targetCalories: number;
}

export async function updateProfile(data: UpdateProfilePayload) {

  return api.patch('/auth/me', data);
}