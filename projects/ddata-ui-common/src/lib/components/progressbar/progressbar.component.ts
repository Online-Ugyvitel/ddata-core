import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'dd-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DdataUiProgressbarComponent implements OnInit {
  private _max = 100;
  private _current = 0;
  progress = 0;

  constructor() {}

  ngOnInit(): void {
    this.progress = (this.current / this.max) * 100;
  }
}
