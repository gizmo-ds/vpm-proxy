export interface VPMPackageManifest {
  name: string;
  id: string;
  author: string;
  url: string;
  packages: Record<
    string,
    {
      versions: Record<string, VPMPackage>;
    }
  >;
}

export interface VPMPackage {
  name: string;
  displayName: string;
  version: string;
  unity: string;
  description: string;
  zipSHA256?: string;
  url: string;
  license?: string;
  repo?: string;
  author?: {
    name: string;
    email?: string;
    url?: string;
  };
  keywords?: string[];
  hideInEditor?: boolean;
  dependencies?: Record<string, string>;
  gitDependencies?: Record<string, string>;
  vpmDependencies?: Record<string, string>;
  legacyFolders?: Record<string, string>;
}
