import { Component, OnInit } from '@angular/core';
import { SelectableListComponent } from '../../../../projects/ddata-core/src/public-api';
import { TagInterface } from 'src/app/dd-select-examples/tag.interface';
import { DdSelectExampleService } from '../dd-select-example.service';
import { Tag } from '../tag.model';

@Component({
    selector: 'app-tag-list',
    templateUrl: './tag-list.component.html',
    standalone: false
})
export class TagListComponent extends SelectableListComponent<TagInterface> implements OnInit {
  constructor(private readonly service: DdSelectExampleService) {
    super(Tag);
  }

  ngOnInit(): void {
    this.models = this.service.getAllTags();
  }

  load(): void {}

  toggleSelect(model: TagInterface): void {
    super.toggleSelect(model);
  }
}
