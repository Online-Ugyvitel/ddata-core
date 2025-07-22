import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'dd-progressbar',
    templateUrl: './progressbar.component.html',
    styleUrls: ['./progressbar.component.css'],
    standalone: false
})
export class DdataUiProgressbarComponent implements OnInit {
  private _max = 100;
  private _current = 0;
  progress = 0;

  @Input() 
  get max(): number {
    return this._max;
  }
  set max(value: number) {
    this._max = value;
    this.calculateProgress();
  }

  @Input()
  get current(): number {
    return this._current;
  }
  set current(value: number) {
    this._current = value;
    this.calculateProgress();
  }

  constructor() { }

  ngOnInit(): void {
    this.calculateProgress();
  }

  private calculateProgress(): void {
    if (this._max > 0) {
      this.progress = Math.round((this._current / this._max) * 100);
    } else {
      this.progress = 0;
    }
  }

}
