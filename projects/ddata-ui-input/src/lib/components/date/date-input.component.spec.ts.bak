// tslint:disable: max-line-length
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseModel, BaseModelInterface, DdataCoreModule, FieldContainerInterface, FieldsInterface, ID, ISODate, ValidatorService } from 'ddata-core';
import { DdataUiInputModule } from '../../ddata-ui-input.module';
import { InputHelperService } from '../../services/input/helper/input-helper.service';
// import { DdataUiInputModule, InputHelperService } from 'ddata-ui-input';
import { DdataInputDateComponent } from './date-input.component';

interface MockModelInterace extends BaseModelInterface<MockModelInterace> {
  // name: string;
  date: ISODate;
}

class MockModel extends BaseModel implements MockModelInterace {
  id: ID;
  // name: string;
  date: ISODate;

  init(data?: any): this {
      data = !!data ? data : {};

      this.id = !!data.id ? data.id : 0;
      // this.name = !!data.name ? data.name : '';
      this.date = !!data.date ? data.date : '';

      return this;
  }
}


describe('DateFieldComponent', () => {
  let component: DdataInputDateComponent;
  let fixture: ComponentFixture<DdataInputDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdataUiInputModule, DdataCoreModule],
      providers: [
        {
          provide: InputHelperService,
          useValue: jasmine.createSpyObj('InputHelperService', ['get', 'randChars'])
        },
        {
          provide: ValidatorService,
          useValue: jasmine.createSpyObj('ValidatorService', ['get'])
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['get'])
        },
        {
          provide: ActivatedRoute,
          useValue: jasmine.createSpyObj('ActivatedRoute', ['get'])
        },
        {
          provide: 'env',
          useValue: jasmine.createSpyObj('EnvService', ['get'])
        },
        {
          provide: HttpClient,
          useValue: jasmine.createSpyObj('HttpClient', ['get'])
        }
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DdataInputDateComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('type in the field change model value', fakeAsync(() => {
    component._model = new MockModel().init({date: '2022-02-19'});
    component._field = 'date';

    fixture.detectChanges();

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    const newDate = '2022-12-12';
    input.value = newDate;
    fixture.debugElement.query(By.css('input')).triggerEventHandler('change', {target: input});
    fixture.detectChanges();

    expect(component._model['date']).toEqual(newDate);
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('ngOnInit() should change selectedValue', () => {
  //   component.model = testModel;

  //   component.ngOnInit();

  //   expect(component.selectedValue).toBe('1970-01-02');
  // });

  // it('change() should set selectedValue from empty string to "2020-07-06"', () => {
  //   const fakeData = {
  //     startDate: {
  //       _d: {
  //         getTime(): number {
  //           return 1;
  //         },
  //         getTimezoneOffset(): number {
  //           return -26567000;
  //         },
  //       }
  //     },
  //   };

  //   // component.change(fakeData);

  //   expect(component.selectedValue).toBe('2020-07-06');
  // });

  // it('change() should set selected from empty string to "2020-01-01"', () => {
  //   const fakeDate = {
  //     target: {
  //       value: '2020-01-01'
  //     }
  //   };

  //   // component.change(fakeDate);

  //   expect(component.selectedValue).toBe('2020-01-01');
  // });

  // it('should emit on "changed" when change() called with valid data', () => {});
  // it('should NOT emit on "changed" when change() called with invalid data', () => {});

  // // input tests
  // it('model input should set _model', () => {});
  // it('model input should set _model on falsy to BaseModel()', () => {});
  // it('model input should set _title, _placeholder, _label, _append and _prepend', () => {});
  // it('model input should set _isRequired to false if field is not required', () => {});
  // it('model input should set _isRequired to true if field is required', () => {});
  // it('model getter should get back the _model', () => {});

  // it('field input should set _field', () => {});
  // it('field input should set _field on falsy to "isValid"', () => {});

  // it('prepend input should set _prepend', () => {});
  // it('prepend input should set _prepend on falsy to empty string', () => {});

  // it('append input should set _append', () => {});
  // it('append input should set _append on falsy to empty string', () => {});

  // it('labelText input should set _label', () => {});
  // it('labelText input should set _label on falsy to empty string', () => {});


});
