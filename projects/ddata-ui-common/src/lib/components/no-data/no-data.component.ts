import { Component, Input, OnInit, Inject } from '@angular/core';
import { ModuleConfiguration } from '../../models/module-configuration/module-configuration.interface';
import { noDataText } from '../../i18n/no-data.lang';
import { faCat, faCrow, faDog, faDove, faDragon, faFrog, faHippo, faHorse, faKiwiBird, faFish, faOtter, faPaw } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'dd-no-data',
    templateUrl: './no-data.component.html',
    styleUrls: ['./no-data.component.scss'],
    standalone: false
})
export class DdataUiNoDataComponent implements OnInit {
  @Inject('config') private config: ModuleConfiguration = {lang: 'en'};
  i18n = noDataText[this.config.lang];

  // tslint:disable-next-line: variable-name
  _text: string;
  @Input() set text(value: string) {
    this._text = value;

    if (this.config.lang === 'hu' && value.match(new RegExp(/^[aáeéiíoóöőuúüűAÁEÉIÍOÓÖŐUÚÜŰ]/)) ) {
      this.article = this.i18n.article_consonant.label;
    }
  }
  @Input() sentence = '';

  article = this.i18n.article_vowel.label;
  randomIcon: any;
  icons = [
    faCat,
    faCrow,
    faDog,
    faDove,
    faDragon,
    faFish,
    faFrog,
    faHippo,
    faHorse,
    faKiwiBird,
    faOtter,
    faPaw,
  ];

  constructor() {
    this.randomIcon = this.icons[Math.floor(Math.random() * this.icons.length)];
  }

  ngOnInit(): void {
  }

}
