declare module "expo-document-picker" {
  export interface DocumentPickerOptions {
    type?: string | string[];
    multiple?: boolean;
    copyToCacheDirectory?: boolean;
  }

  export interface DocumentResultSuccess {
    type: "success";
    uri: string;
    name: string;
    size?: number;
  }

  export interface DocumentResultCancel {
    type: "cancel";
  }

  export type DocumentResult = DocumentResultSuccess | DocumentResultCancel;

  export function getDocumentAsync(
    options?: DocumentPickerOptions
  ): Promise<DocumentResult>;
}
