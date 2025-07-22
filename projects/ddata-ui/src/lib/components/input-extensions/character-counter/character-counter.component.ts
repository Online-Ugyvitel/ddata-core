import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'dd-character-counter',
  templateUrl: './character-counter.component.html',
  styleUrls: ['./character-counter.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterCounterComponent {
  @Input() maxLength: number;

  currentLengthValue = '';

  @Input() set currentLength(value: string) {
    if (value !== undefined) {
      this.currentLengthValue = value;
    }
  }

  constructor() {}
}
