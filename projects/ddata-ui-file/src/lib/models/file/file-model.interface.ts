// import { FolderInterface } from '../folder/folder.interface';
// tslint:disable-next-line: max-line-length
import {
  FileNameSlug,
  FileName,
  FileNameWithPath,
  FileSizeInByte,
  ID,
  BaseModelWithoutTypeDefinitionInterface,
  FieldsInterface,
  MimeType
} from 'ddata-core';

export interface FileModelUIFieldsInterface {
  file_name_and_path: FileNameWithPath;
  file_name_slug: FileNameSlug;
  name: FileName;
  size: FileSizeInByte;
  mimetype: MimeType;
  folder_id: ID;
  is_primary: boolean;
  title: string;
}
export interface FileModelInterface
  extends FileModelUIFieldsInterface,
    BaseModelWithoutTypeDefinitionInterface,
    FieldsInterface<FileModelUIFieldsInterface> {
  id: ID;
  is_image: boolean; // UI fields only

  // folder: FolderInterface;
}
