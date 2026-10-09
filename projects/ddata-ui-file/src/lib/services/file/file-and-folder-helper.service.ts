// tslint:disable: max-line-length
import { Injectable } from '@angular/core';
import {
  faFile,
  faFileAlt,
  faFileArchive,
  faFileAudio,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFileUpload,
  faFileVideo,
  faFileWord,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class FileAndFolderHelperService {
  icon = {
    file: faFile,
    document: faFileWord,
    excel: faFileExcel,
    spreadsheet: faFileExcel,
    pdf: faFilePdf,
    archive: faFileArchive,
    text: faFileAlt,
    exe: faFileUpload,
    audio: faFileAudio,
    video: faFileVideo,
    image: faFileImage,
    unknown: faFile
  };

  constructor() {}

  setFileType(typeString: string): IconDefinition {
    let icon = this.icon.file;

    if (typeString === 'text/plain') {
      icon = this.icon.text;
    } else if (typeString === 'application/pdf') {
      icon = this.icon.pdf;
    } else if (typeString === 'application/x-msdownload') {
      icon = this.icon.exe;
    } else if (typeString === 'application/x-zip-compressed') {
      icon = this.icon.archive;
    } else if (typeString === 'application/zip') {
      icon = this.icon.archive;
    } else if (typeString === 'application/x-rar') {
      icon = this.icon.archive;
    } else if (typeString === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      icon = this.icon.excel;
    } else if (typeString === 'application/vnd.ms-excel') {
      icon = this.icon.excel;
    } else if (typeString === 'application/msword') {
      icon = this.icon.document;
    } else if (typeString === 'text/rtf') {
      icon = this.icon.document;
    } else if (
      typeString === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      icon = this.icon.document;
    } else if (typeString === 'application/vnd.oasis.opendocument.text') {
      icon = this.icon.document;
    } else if (typeString === 'application/vnd.oasis.opendocument.spreadsheet') {
      icon = this.icon.spreadsheet;
    } else if (typeString.match('^audio/')) {
      icon = this.icon.audio;
    } else if (typeString.match('^video/')) {
      icon = this.icon.video;
    } else if (typeString.match('^image/')) {
      icon = this.icon.image;
    } else {
      icon = this.icon.unknown;
    }

    return icon;
  }
}
