import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { faTag, faTimes } from '@fortawesome/free-solid-svg-icons';

interface TagInterface {
  name: string;
}

@Component({
  selector: 'dd-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DdataUiTagComponent {
  @Input() tag: TagInterface;
  @Input() showIcon = true;
  @Output() readonly delete: EventEmitter<TagInterface> = new EventEmitter();

  // tslint:disable-next-line: variable-name
  _class: string;
  @Input() set class(value: string) {
    this._class = `${value} tag`;
  }

  icon = {
    tag: faTag,
    times: faTimes
  };

  deleteTag(): void {
    this.delete.emit(this.tag);
  }
}
