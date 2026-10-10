export type Session = {
  accessToken: string;
  user: {
    id: string;
    email?: string;
    name?: string;
  };
};

/**
 * Placeholder until real auth is wired.
 * Returns null when unauthenticated.
 */
export function getClientSession(): Session | null {
  return null;
}
