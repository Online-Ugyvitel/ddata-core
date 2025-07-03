import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'dd-progressbar',
    templateUrl: './progressbar.component.html',
    styleUrls: ['./progressbar.component.css'],
    standalone: false
})
export class DdataUiProgressbarComponent implements OnInit {
  @Input() max = 100;
  @Input() current = 0;
  progress = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
