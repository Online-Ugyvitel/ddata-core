import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { DdataUiTagComponent } from './tag.component';
import { DdataUiCommonModule } from '../../ddata-ui-common.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Mock interface for testing
interface TagInterface {
  name: string;
}

describe('DdataUiTagComponent', () => {
  let component: DdataUiTagComponent;
  let fixture: ComponentFixture<DdataUiTagComponent>;
  let debugElement;
  let element;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DdataUiTagComponent],
      imports: [FontAwesomeModule],
      providers: [Injector]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiTagComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.showIcon).toBe(true);
    expect(component.icon.tag).toBeDefined();
    expect(component.icon.times).toBeDefined();
  });

  it("class property should set _class to be the given value + ' tag'", () => {
    component._class = '';
    component.class = 'Valami';

    expect(component._class).toBe('Valami tag');
  });

  it('should handle empty string for class setter', () => {
    component.class = '';

    expect(component._class).toBe(' tag');
  });

  it('should handle undefined/null for class setter', () => {
    component.class = null;

    expect(component._class).toBe('null tag');

    component.class = undefined;

    expect(component._class).toBe('undefined tag');
  });

  it('should handle multiple class values', () => {
    component.class = 'class1 class2 class3';

    expect(component._class).toBe('class1 class2 class3 tag');
  });

  it('should handle showIcon input property', () => {
    component.showIcon = false;

    expect(component.showIcon).toBe(false);

    component.showIcon = true;

    expect(component.showIcon).toBe(true);
  });

  it('should handle tag input property', () => {
    const testTag: TagInterface = { name: 'Test Tag Name' };

    component.tag = testTag;

    expect(component.tag).toBe(testTag);
    expect(component.tag.name).toBe('Test Tag Name');
  });

  it('should have correct icon properties from FontAwesome', () => {
    expect(component.icon).toBeDefined();
    expect(component.icon.tag).toBeDefined();
    expect(component.icon.times).toBeDefined();
  });

  it("deleteTag() method should call the delete property's emit", () => {
    const fakeModel: TagInterface = { name: 'test tag' };

    component.tag = fakeModel;
    const fakeSpy = vi.spyOn(component.delete, 'emit').mockReturnValue(undefined);

    component.deleteTag();

    expect(fakeSpy).toHaveBeenCalledWith(fakeModel);
  });

  it('deleteTag() method should emit undefined when tag is not set', () => {
    const fakeSpy = vi.spyOn(component.delete, 'emit').mockReturnValue(undefined);

    component.deleteTag();

    expect(fakeSpy).toHaveBeenCalledWith(undefined);
  });

  it('deleteTag() method should emit null when tag is null', () => {
    component.tag = null;
    const fakeSpy = vi.spyOn(component.delete, 'emit').mockReturnValue(undefined);

    component.deleteTag();

    expect(fakeSpy).toHaveBeenCalledWith(null);
  });

  it('should handle _class property directly', () => {
    component._class = 'direct-assignment';

    expect(component._class).toBe('direct-assignment');
  });

  it('should verify delete EventEmitter is properly initialized', () => {
    expect(component.delete).toBeDefined();
    expect(typeof component.delete.emit).toBe('function');
  });

  describe('template', () => {
    const render = (inputs: {
      tag?: TagInterface;
      showIcon?: boolean;
      class?: string;
    }): HTMLElement => {
      Object.entries(inputs).forEach(([name, value]) => fixture.componentRef.setInput(name, value));
      fixture.detectChanges();

      return element as HTMLElement;
    };

    it('should render the tag name, the tag icon and the delete button by default', () => {
      const host = render({ tag: { name: 'Angular' }, class: 'badge' });
      const wrapper = host.querySelector<HTMLElement>(':scope > span');

      expect(wrapper.className).toBe('badge tag');
      expect(wrapper.querySelector(':scope > span').textContent.trim()).toBe('Angular');
      // the tag icon + the times icon of the delete button
      expect(host.querySelectorAll('fa-icon').length).toBe(2);
      expect(host.querySelectorAll('button fa-icon').length).toBe(1);
    });

    it('should hide the tag icon when showIcon is false', () => {
      const host = render({ tag: { name: 'No icon' }, showIcon: false });

      expect(host.querySelectorAll('fa-icon').length).toBe(1);
      expect(host.querySelector('button fa-icon')).not.toBeNull();
    });

    it('should toggle the tag icon when showIcon changes', () => {
      render({ tag: { name: 'Toggle' }, showIcon: false });

      expect(element.querySelectorAll('fa-icon').length).toBe(1);

      render({ showIcon: true });

      expect(element.querySelectorAll('fa-icon').length).toBe(2);
    });

    it.each([
      ['null', null],
      ['undefined', undefined]
    ])('should render an empty name when the tag is %s', (_label, tag) => {
      const host = render({ tag, showIcon: false });

      expect(host.querySelector(':scope > span > span').textContent.trim()).toBe('');
    });

    it('should render an empty name when the tag has no name', () => {
      const host = render({ tag: {} as TagInterface });

      expect(host.querySelector(':scope > span > span').textContent.trim()).toBe('');
    });

    it('should not set a wrapper class when the class input was never set', () => {
      const host = render({ tag: { name: 'Plain' } });

      expect(host.querySelector(':scope > span').className).toBe('');
    });

    it('should emit the current tag when the delete button is clicked', () => {
      const tag: TagInterface = { name: 'Remove me' };
      const emitted: Array<TagInterface> = [];

      component.delete.subscribe((value: TagInterface) => emitted.push(value));
      render({ tag }).querySelector('button').click();

      expect(emitted).toEqual([tag]);
      expect(emitted[0]).toBe(tag);
    });

    it('should emit null when the delete button of a tag without value is clicked', () => {
      const emitted: Array<TagInterface> = [];

      component.delete.subscribe((value: TagInterface) => emitted.push(value));
      render({ tag: null }).querySelector('button').click();

      expect(emitted).toEqual([null]);
    });
  });
});
