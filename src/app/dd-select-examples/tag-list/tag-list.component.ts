import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { SelectableListComponent } from '../../../../projects/ddata-core/src/public-api';
import { TagInterface } from '../tag.interface';
import { DdSelectExampleService } from '../dd-select-example.service';
import { Tag } from '../tag.model';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListComponent extends SelectableListComponent<TagInterface> implements OnInit {
  private readonly service = inject(DdSelectExampleService);

  constructor() {
    super(Tag);
  }

  ngOnInit(): void {
    this.models = this.service.getAllTags();
  }

  toggleSelect(model: TagInterface): void {
    super.toggleSelect(model);
  }
}
