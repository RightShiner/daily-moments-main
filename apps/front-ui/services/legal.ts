import { join } from 'path';
import glob from 'glob';
import fs from 'fs';

const legalPolicyContentDirectory = join(process.cwd(), 'apps/front-ui/content/legal');

const getLegalPolicyStore = (): Map<string, string> => {
  const legalPolicies = glob.sync(
    legalPolicyContentDirectory + '/**/*.{md,mdx}',
  ) as string[];
  return new Map(
    legalPolicies.map((f) => {
      const slug = f.substring(f.lastIndexOf('/') + 1, f.lastIndexOf('.'));
      const bp = fs.readFileSync(f, 'utf8');
      return [slug, bp];
    }),
  );
};

export const getLegalPolicyBySlug = (slug: string): string => {
  const store = getLegalPolicyStore();
  return store.get(slug);
};
