import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dd-word-counter',
  templateUrl: './word-counter.component.html',
  styleUrls: ['./word-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  static countWords(value: unknown): number {
    if (typeof value !== 'string' || value.length === 0) {
      return 0;
    }

    return value.split(',').length;
  }

  wordsNumber(): number {
    const wordsCount = WordCounterComponent.countWords(this._currentLength);

    if (wordsCount === 0) {
      return 0;
    }

    this.maxLengthReached.emit(this.maxLength > 0 && wordsCount > this.maxLength);

    return wordsCount;
  }
}
