import 'zone.js/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
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
      providers: [
        Injector
      ]
    })
      .compileComponents();
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

  it('should execute ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('class property should set _class to be the given value + \' tag\'', () => {
    component._class = '';
    component.class = 'Valami';
    expect(component._class).toBe('Valami tag');
  });

  it('should handle empty string for class setter', () => {
    component.class = '';
    expect(component._class).toBe(' tag');
  });

  it('should handle undefined/null for class setter', () => {
    component.class = null as any;
    expect(component._class).toBe('null tag');
    
    component.class = undefined as any;
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

  it('deleteTag() method should call the delete property\'s emit', () => {
    const fakeModel: TagInterface = { name: 'test tag' };
    component.tag = fakeModel;
    const fakeSpy = spyOn(component.delete, 'emit');
    component.deleteTag();
    expect(fakeSpy).toHaveBeenCalledWith(fakeModel);
  });

  it('deleteTag() method should emit undefined when tag is not set', () => {
    const fakeSpy = spyOn(component.delete, 'emit');
    component.deleteTag();
    expect(fakeSpy).toHaveBeenCalledWith(undefined);
  });

  it('deleteTag() method should emit null when tag is null', () => {
    component.tag = null as any;
    const fakeSpy = spyOn(component.delete, 'emit');
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
});
