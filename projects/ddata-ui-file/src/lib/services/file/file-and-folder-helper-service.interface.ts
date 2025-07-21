import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface FileAndFolderHelperServiceInterface {
  icon: Record<string, unknown>;

  setFileType(typeString: string): IconDefinition;
}
