/**
 * Public visibility controls for project records.
 * Hidden records remain in Firestore and the CMS; only public discovery/routes
 * are restricted here.
 */
export const HIDDEN_PUBLIC_PROJECT_SLUGS = new Set<string>([
  'proyek-1792842863315',
]);

export const isPublicProjectVisible = (slug: string): boolean =>
  !HIDDEN_PUBLIC_PROJECT_SLUGS.has(slug);

export const normalizePublicProjectRoute = (path: string): string => {
  const projectPrefix = '/projects/';
  if (!path.startsWith(projectPrefix)) return path;

  const slug = path.slice(projectPrefix.length).split('/')[0];
  return isPublicProjectVisible(slug) ? path : '/projects';
};
