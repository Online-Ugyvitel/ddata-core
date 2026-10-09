import { Injectable } from '@angular/core';
import { FileModel } from '../../models/file/file.model';
import { FileModelInterface } from '../../models/file/file-model.interface';
import { ProxyService } from 'ddata-core';

@Injectable({
  providedIn: 'root'
})
export class FileService extends ProxyService<FileModelInterface> {
  constructor() {
    super(new FileModel());
  }
}
