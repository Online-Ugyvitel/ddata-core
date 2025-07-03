import { value } from './../../i18n/banknote.lang';
import { Component, Input, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { of } from 'rxjs';
import { Name, MultilanguageNameInterface } from 'src/app/models/name/name.model';
import { LangService } from 'src/app/services/lang/lang.service';
import { LangInterface } from 'src/app/models/lang/lang.interface';
import { trigger, state, style } from '@angular/animations';
import { Global } from 'src/app/models/global.model';
import { getMatLegacyTooltipInvalidPositionError as getMatTooltipInvalidPositionError } from '@angular/material/legacy-tooltip';

@Component({
    selector: 'app-multilanguage-name',
    templateUrl: './multilanguage-name.component.html',
    styleUrls: ['./multilanguage-name.component.scss'],
    standalone: false
})
export class MultilanguageNameComponent implements OnInit {
  @Input() model: MultilanguageNameInterface;
  @Input() placeholder = 'Név';
  @Input() title = 'Név';

  show = true;
  langs: LangInterface[] = [];
  global: Global = new Global();
  icon = this.global.icon;

  constructor(
    langService: LangService
  ) {
    langService.getAllSortedBy('name').subscribe((result: LangInterface[]) => {
      this.langs = result;
    });
  }

  ngOnInit() {
  }

  addName() {
    this.model.names.push(new Name().init({lang_id: 1}));
  }

  deleteName(name: Name) {
    if (!name) {
      return;
    }

    this.model.names.splice(this.model.names.indexOf(name), 1);
  }

 getTotal() {
    return this.model.names.length - 1;
  }
}
