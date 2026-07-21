'use client';

import { useState } from 'react';
import { CodeWithPackageManager } from './code-with-package-manager';

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

const managerCommands: Record<PackageManager, string> = {
  npm: 'npm install',
  pnpm: 'pnpm add',
  yarn: 'yarn add',
  bun: 'bun add',
};

interface InstallCommandProps {
  packages: string;
}

export function InstallCommand({ packages }: InstallCommandProps) {
  const [manager, setManager] = useState<PackageManager>('pnpm');

  return (
    <CodeWithPackageManager
      code={`${managerCommands[manager]} ${packages}`}
      packageManager={manager}
      onPackageManagerChange={setManager}
      language="bash"
    />
  );
}
