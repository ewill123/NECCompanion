declare module "expo-document-picker" {
  export function getDocumentAsync(options?: {
    type?: string | string[];
    multiple?: boolean;
    copyToCacheDirectory?: boolean;
  }): Promise<{
    type: "success" | "cancel";
    uri: string;
    name: string;
    size?: number;
  }>;
}
