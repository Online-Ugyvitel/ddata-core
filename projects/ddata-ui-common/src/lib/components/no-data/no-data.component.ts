import { Component, Input, OnInit, Inject, Optional, ChangeDetectionStrategy } from '@angular/core';
import { ModuleConfigurationInterface } from '../../models/module-configuration/module-configuration.interface';
import { noDataText } from '../../i18n/no-data.lang';
import {
  faCat,
  faCrow,
  faDog,
  faDove,
  faDragon,
  faFrog,
  faHippo,
  faHorse,
  faKiwiBird,
  faFish,
  faOtter,
  faPaw,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'dd-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DdataUiNoDataComponent implements OnInit {
  @Input() sentence = '';

  private readonly config: ModuleConfigurationInterface;

  // tslint:disable-next-line: variable-name
  _text: string;
  @Input() set text(value: string) {
    this._text = value;

    if (this.config.lang === 'hu' && /^[aáeéiíoóöőuúüűAÁEÉIÍOÓÖŐUÚÜŰ]/.test(value ?? '')) {
      this.article = this.i18n.article_consonant.label;
    }
  }

  i18n: (typeof noDataText)['en' | 'hu'];
  article: string;
  randomIcon: IconDefinition;
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
    faPaw
  ];

  constructor(@Optional() @Inject('config') config?: ModuleConfigurationInterface | null) {
    this.config = config ?? { lang: 'en' };
    this.i18n = noDataText[this.config.lang];
    this.article = this.i18n.article_vowel.label;
    this.randomIcon = this.icons[Math.floor(Math.random() * this.icons.length)];
  }

  ngOnInit(): void {
    this.randomIcon = this.icons[Math.floor(Math.random() * this.icons.length)];
  }
}
