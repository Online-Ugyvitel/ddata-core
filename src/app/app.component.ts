import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'ddata-lib';
}
