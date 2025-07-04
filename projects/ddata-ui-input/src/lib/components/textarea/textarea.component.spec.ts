import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BaseModel, ValidatorService } from 'ddata-core';
import { DdataTextareaComponent } from './textarea.component';

xdescribe('DdataTextareaComponent', () => {
  let component: DdataTextareaComponent;
  let fixture;


  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdataTextareaComponent],
      providers: [ValidatorService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    // AppModule.InjectorInstance = TestBed;
    fixture = TestBed.overrideComponent(DdataTextareaComponent, {
      set: {
        template: '<div class="input-group">\
        <label [class]="labelClass" [for]="field" *ngIf="showLabel">\
            Label:\
            <ng-container *ngIf="true">\
              <span *ngIf="true"> *</span>\
            </ng-container>\
        </label>\
        <textarea *ngIf="!isViewOnly"\
            [id]="field"\
            [class.invalid]="false"\
            [class]="textareaClass"\
            [rows]="rowsNumber"\
            [disabled]="disabled">\
        </textarea>\
        <div *ngIf="isViewOnly"\
          [class]="textareaClass + \' border-0 bg-light\'">\
          \
        </div>\
    </div>'
      }
    })
      .createComponent(DdataTextareaComponent);
    fixture.detectChanges();
  });
  afterEach(() => {
    document.body.removeChild(fixture.debugElement.nativeElement);
  });

  it('should create', () => {
    component = new DdataTextareaComponent();
    expect(component).toBeTruthy();
  });

  it('getTitle() should return title', () => {
    component = new DdataTextareaComponent();
    component.field = 'fake';
    component.model = {
      fields: {
        fake: {
          title: 'a',
        }
      }
    } as unknown as BaseModel;

    let fakestring = component._title;
    expect(fakestring).toBeDefined();
    expect(fakestring).toBe('a');

    component.model.fields = {};

    fakestring = component._title;
    expect(fakestring).toBeDefined();
    expect(fakestring).toBe('');
  });

  it('getLabel() should return label', () => {
    component = new DdataTextareaComponent();
    component.field = 'fake';
    component.model = {
      fields: {
        fake: {
          label: 'a',
        }
      }
    } as unknown as BaseModel;

    let fakestring = component._label;
    expect(fakestring).toBeDefined();
    expect(fakestring).toBe('a');

    component.model.fields = {};

    fakestring = component._label;
    expect(fakestring).toBeDefined();
    expect(fakestring).toBe('Az adatmező címke nincs definiálva a modelben.');
  });

  it('getPlaceholder() should return placeholder', () => {
    component = new DdataTextareaComponent();
    component.field = 'fake';
    component.model = {
      fields: {
        fake: {
          placeholder: 'a',
        }
      }
    } as unknown as BaseModel;

    let fakestring = component._placeholder;
    expect(fakestring).toBeDefined();
    expect(fakestring).toBe('a');

    component.model.fields = {};

    fakestring = component._placeholder;
    expect(fakestring).toBeDefined();
    expect(fakestring).toBe('');
  });
});
