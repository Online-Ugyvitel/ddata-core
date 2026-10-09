import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputHelperService } from 'projects/ddata-ui-input/src/public-api';
import { DdSelectExampleService } from './dd-select-example.service';

@Component({
  selector: 'dd-select-examples',
  templateUrl: './dd-select-examples.component.html',
  providers: [InputHelperService, DdSelectExampleService],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdSelectExamplesComponent {}
