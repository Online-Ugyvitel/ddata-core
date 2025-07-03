import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTag, faTimes } from '@fortawesome/free-solid-svg-icons';

interface TagInterface {
  name: string;
}

@Component({
    selector: 'dd-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss'],
    standalone: false
})
export class DdataUiTagComponent implements OnInit {
  // tslint:disable-next-line: variable-name
  _class: string;
  @Input() tag: TagInterface;
  @Input() set class(value: string) {
    this._class = value + ' tag';
  }
  @Input() showIcon = true;
  @Output() delete: EventEmitter<TagInterface> = new EventEmitter();

  icon = {
    tag: faTag,
    times: faTimes,
  };

  constructor() { }

  ngOnInit(): void {
  }

  deleteTag(): void {
    this.delete.emit(this.tag);
  }

}
