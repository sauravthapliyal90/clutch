// Shapes the outward-facing response - hides internal fields
// (isProfileComplete flags, timestamps we don't want to expose, etc.)
// that services might otherwise return straight from Prisma.
export function toUserDto(user: {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  role: string;
}) {
  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
