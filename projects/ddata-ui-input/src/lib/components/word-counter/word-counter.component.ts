import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
    selector: 'app-word-counter',
    templateUrl: './word-counter.component.html',
    styleUrls: ['./word-counter.component.scss'],
    // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})
export class WordCounterComponent {
  @Input() maxLength = 0;

  @Input() set currentLength(value: string | undefined | null) {
    if (!value) {
      return;
    }

    this._currentLength = value;
  }

  @Output() readonly maxLengthReached: EventEmitter<boolean> = new EventEmitter();

  _currentLength = '';

  constructor() {}

  wordsNumber(): number {
    if (this._currentLength.length === 0) {
      return 0;
    }
    const wordsCount = this._currentLength.split(',').length;

    this.maxLengthReached.emit(this.maxLength > 0 && wordsCount > this.maxLength);

    return wordsCount;
  }
}
