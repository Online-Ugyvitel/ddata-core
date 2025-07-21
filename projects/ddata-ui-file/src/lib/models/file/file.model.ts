// tslint:disable: variable-name
// tslint:disable-next-line: max-line-length
import { Inject } from '@angular/core';
import {
  BaseModel,
  FieldContainerInterface,
  FileName,
  FileNameSlug,
  FileNameWithPath,
  FileSizeInByte,
  ID,
  MimeType,
  ValidationRuleInterface
} from 'ddata-core';
import { FileModelInterface, FileModelUIFieldsInterface } from './file-model.interface';
// import { Folder } from 'projects/ddata-ui/src/lib/models/folder/folder.model';

export class FileModel extends BaseModel implements FileModelInterface {
  @Inject('config') private readonly config: unknown;
  readonly api_endpoint = '/file/';
  readonly model_name = 'FileModel';
  order: number; // only UI field
  id: ID;
  file_name_and_path: FileNameWithPath;
  file_name_slug: FileNameSlug;
  name: FileName;
  size: FileSizeInByte;
  mimetype: MimeType;
  folder_id: ID;
  is_image: boolean; // UI fields only
  is_primary = false;
  title: 'Fájl';

  folder: unknown;

  validationRules: ValidationRuleInterface = {
    id: ['required', 'integer'],
    file_name_and_path: ['required', 'string'],
    file_name_slug: ['required', 'string'],
    name: ['required', 'string'],
    size: ['required', 'integer', 'not_zero'],
    mimetype: ['required', 'string'],
    folder_id: ['required', 'integer']
  };

  fields: FieldContainerInterface<FileModelUIFieldsInterface>;

  init(data: Partial<FileModelInterface> = {}): FileModelInterface {
    const initData = data || {};

    this.id = initData.id ? initData.id : (0 as ID);
    this.folder_id = initData.folder_id ? initData.folder_id : (0 as ID);
    this.name = initData.name ? initData.name : ('' as FileName);
    this.file_name_and_path = initData.file_name_and_path
      ? initData.file_name_and_path
      : ('' as FileNameWithPath);
    this.file_name_slug = initData.file_name_slug ? initData.file_name_slug : ('' as FileNameSlug);
    this.size = initData.size ? initData.size : (0 as FileSizeInByte);
    this.mimetype = initData.mimetype ? initData.mimetype : ('' as MimeType);
    // Remove properties not in interface for now
    // this.is_main = initData.is_main ? initData.is_main : false;
    // this.order = initData.order ? initData.order : 0;
    // this.created_at = initData.created_at ? initData.created_at : '';
    // this.updated_at = initData.updated_at ? initData.updated_at : '';
    // this.folder = initData.folder ? initData.folder : null;

    return this;
  }

  prepareToSave(): Partial<FileModelInterface> {
    return {
      id: this.id ? this.id : (0 as ID),
      folder_id: this.folder_id ? this.folder_id : (0 as ID),
      name: this.name ? this.name : ('' as FileName),
      file_name_and_path: this.file_name_and_path
        ? this.file_name_and_path
        : ('' as FileNameWithPath),
      file_name_slug: this.file_name_slug ? this.file_name_slug : ('' as FileNameSlug),
      size: this.size ? this.size : (0 as FileSizeInByte),
      mimetype: this.mimetype ? this.mimetype : ('unknown' as MimeType),
      is_primary: this.is_primary ? true : false
    };
  }
}
