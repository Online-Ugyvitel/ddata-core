import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TabNavigationServiceInterface,
  TabsetInterface
} from '../../../models/tab/tab-navigation.interface';
import { TabButtonComponent } from './tab-button.component';

class FakeTabNavigationService implements TabNavigationServiceInterface {
  moveInTabsLeft(tabset: TabsetInterface): void {
    this.move(tabset, -1);
  }

  moveInTabsRight(tabset: TabsetInterface): void {
    this.move(tabset, 1);
  }

  private move(tabset: TabsetInterface, step: number): void {
    const current = tabset.tabs.findIndex((tab) => tab.active);
    const next = (current + step + tabset.tabs.length) % tabset.tabs.length;

    tabset.tabs.forEach((tab, index) => (tab.active = index === next));
  }
}

describe('TabButtonComponent', () => {
  let component: TabButtonComponent;
  let fixture: ComponentFixture<TabButtonComponent>;
  let tabset: TabsetInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabButtonComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(TabButtonComponent);
    component = fixture.componentInstance;
    tabset = { tabs: [{ active: true }, { active: false }, { active: false }] };
    component.service = new FakeTabNavigationService();
    component.tabSetComponent = tabset;
  });

  it('should show the "last page" and "next page" buttons on the first tab', () => {
    fixture.detectChanges();
    const texts = Array.from(fixture.nativeElement.querySelectorAll('button')).map(
      (button: HTMLButtonElement) => button.textContent.trim()
    );

    expect(texts).toEqual(['Utolsó oldal', 'Következő oldal']);
  });

  it('nextTab() should move to the next tab', () => {
    const spy = vi.spyOn(component.service, 'moveInTabsRight');

    component.nextTab();

    expect(spy).toHaveBeenCalledWith(tabset);
    expect(component.currentTab).toBe(1);
    expect(component.tabLength).toBe(3);
    expect(component.lastTab).toBe(false);
  });

  it('nextTab() should mark the last tab', () => {
    component.nextTab();
    component.nextTab();

    expect(component.currentTab).toBe(2);
    expect(component.lastTab).toBe(true);
  });

  it('previousTab() should move to the previous tab', () => {
    const spy = vi.spyOn(component.service, 'moveInTabsLeft');

    component.previousTab();

    expect(spy).toHaveBeenCalledWith(tabset);
    expect(component.currentTab).toBe(2);
    expect(component.lastTab).toBe(true);
  });

  it('should not change the state without a tabset', () => {
    component.tabSetComponent = undefined;
    component.service = { moveInTabsLeft: vi.fn(), moveInTabsRight: vi.fn() };

    component.nextTab();

    expect(component.currentTab).toBe(0);
    expect(component.lastTab).toBeUndefined();
  });
});
