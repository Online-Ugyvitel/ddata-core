import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import 'zone.js/testing';
import { DdataUiTagComponent } from './tag.component';

describe('DdataUiTagComponent', () => {
  let component: DdataUiTagComponent;
  let fixture: ComponentFixture<DdataUiTagComponent>;
  let debugElement;
  let element;

  beforeEach(() => {
    TestBed.configureTestingModule({
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

  it('class property should set _class to be the given value + \' tag\'', () => {
    component._class = '';
    component.class = 'Valami';

    expect(component._class).toBe('Valami tag');
  });

  it("deleteTag() method should call the delete property's emit", () => {
    const fakeModel = { name: 'Test Tag' } as any;
    component.tag = fakeModel;
    const fakeSpy = spyOn(component.delete, 'emit');

    component.deleteTag();

    expect(fakeSpy).toHaveBeenCalledWith(fakeModel);
  });
});
