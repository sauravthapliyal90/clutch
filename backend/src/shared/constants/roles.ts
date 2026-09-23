export const ROLES = {
  USER: 'USER',
  HOST: 'HOST',
  ADMIN: 'ADMIN',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];
