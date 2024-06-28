import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'character-counter',
  templateUrl: './character-counter.component.html',
  styleUrls: ['./character-counter.component.css'],
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default
})
export class CharacterCounterComponent {
  @Input() maxLength: number = 0;

  @Input() set currentLength(value: string | null | undefined) {
    if (!value) {
      return;
    }

    this._currentLength = value;
  }

  _currentLength = '';

  constructor() {}
}
