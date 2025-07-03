import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'character-counter',
    templateUrl: './character-counter.component.html',
    styleUrls: ['./character-counter.component.css'],
    standalone: false
})
export class CharacterCounterComponent implements OnInit {
  _currentLength = '';
  @Input() maxLength: number;
  @Input() set currentLength(value: string) {
    if (value !== undefined) {
      this._currentLength = value;
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
