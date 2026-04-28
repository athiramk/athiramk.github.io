// Returns the Vite base path for use with public assets at runtime
export const BASE_PATH = import.meta.env.BASE_URL;

export function publicUrl(path: string): string {
  // Remove leading slash from path to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_PATH}${cleanPath}`;
}
