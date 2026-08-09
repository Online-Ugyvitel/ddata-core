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
  title = 'Fájl';

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

  // Accept any raw data so tests and external callers can supply primitive literals
  // that will be coerced into the branded domain field types internally.
  // (Using `any` here avoids widespread casting in tests for branded types.)
  init(data: any = {}): FileModelInterface {
    const d = data || {};

    // Allow raw primitives in tests and coerce to branded types
    this.id = (d.id as unknown as ID) ?? (0 as ID);
    
    if (this.id === (undefined as unknown as ID) || this.id === (null as unknown as ID)) {
      this.id = 0 as ID;
    }
    
    this.folder_id = (d.folder_id as unknown as ID) ?? (0 as ID);
    
    if (
      this.folder_id === (undefined as unknown as ID) ||
      this.folder_id === (null as unknown as ID)
    ) {
      this.folder_id = 0 as ID;
    }
    
    this.name = (d.name as unknown as FileName) ?? ('' as FileName);

    this.file_name_and_path =
      (d.file_name_and_path as unknown as FileNameWithPath) ?? ('' as FileNameWithPath);
    this.file_name_slug = (d.file_name_slug as unknown as FileNameSlug) ?? ('' as FileNameSlug);
    this.size = (d.size as unknown as FileSizeInByte) ?? (0 as FileSizeInByte);
    
    if (
      (this.size as unknown as number) === undefined ||
      (this.size as unknown as number) === null
    ) {
      this.size = 0 as FileSizeInByte;
    }
    
    this.mimetype = (d.mimetype as unknown as MimeType) ?? ('' as MimeType);

    // Convert is_primary truthy/falsy semantics
    this.is_primary = !!(d as Record<string, unknown>).is_primary;
    // is_image detection (simple startsWith check on mimetype)
    const mimetypeStr = (this.mimetype as unknown as string) || '';

    this.is_image = mimetypeStr.startsWith('image/');

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
