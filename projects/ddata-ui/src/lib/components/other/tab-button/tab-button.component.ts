import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TabService } from 'src/app/services/tab/tab.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'dd-tab-button',
  templateUrl: './tab-button.component.html',
  styleUrls: ['./tab-button.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabButtonComponent {
  @Input() service: TabService;

  tabSetComponent: TabsetComponent;
  currentTab = 0;
  lastTab: boolean;
  tabLength: number;

  constructor() {}

  previousTab(): void {
    this.service.moveInTabsLeft(this.tabSetComponent);
    this.switchButtonName(this.tabSetComponent);
  }

  nextTab(): void {
    this.service.moveInTabsRight(this.tabSetComponent);
    this.switchButtonName(this.tabSetComponent);
  }

  private switchButtonName(tabset: TabsetComponent): void {
    if (!!tabset) {
      this.lastTab = false;

      this.currentTab = tabset.tabs.map((i) => i.active).indexOf(true);
      this.tabLength = tabset.tabs.length;

      if (this.currentTab + 1 === this.tabLength) {
        this.lastTab = true;
      }
    }
  }
}
