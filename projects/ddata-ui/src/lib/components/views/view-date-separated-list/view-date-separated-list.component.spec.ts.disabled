import { ViewDateSeparatedList } from 'src/app/models/view/date/separated/list/view-date-spearated-list.interface';
import { ISODate, ID } from 'src/app/models/base-model/base-data-type.model';
import { CasefileInterface } from 'src/app/models/casefile/casefile.interface';
import { style } from '@angular/animations';
import { AppModule } from 'src/app/app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDateSeparatedListComponent } from './view-date-separated-list.component';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Renderer2, ElementRef } from '@angular/core';
import * as moment from 'moment';

xdescribe('ViewDateSeparatedListComponent', () => {
  let component: ViewDateSeparatedListComponent;
  let fixture: ComponentFixture<ViewDateSeparatedListComponent>;

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
      declarations: [ ViewDateSeparatedListComponent ],
      providers: [
        Renderer2
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    AppModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(ViewDateSeparatedListComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.removeChild(fixture.debugElement.nativeElement);
  });

  it('should create', () => {
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('setHeight() should set the height of the component', () => {
    component = fixture.componentInstance;
    component.listContainer = new ElementRef(document.createElement('div'));
    component.setHeight();
    expect(component.listContainer.nativeElement.style.height).toBe(document.documentElement.clientHeight - 189 + 'px');
  });

  it('convertToDateSeparatedList should return an array with lists', () => {
    const fakedata: CasefileInterface[] = [
      {
        deadline: '2020' as ISODate
      } as unknown as CasefileInterface,
      {
        deadline: '2021' as ISODate
      } as unknown as CasefileInterface
    ];
    component = fixture.componentInstance;

    const spy = spyOn(component, 'setListItemName').and.callThrough();

    let convertedData = component.convertToDateSeparatedList(fakedata);
    expect(convertedData.length).toBe(2);
    expect(convertedData[0]).toBeInstanceOf(ViewDateSeparatedList);

    fakedata[1].deadline = '2020' as ISODate;
    fakedata[0].deadline = '2020' as ISODate;
    convertedData = component.convertToDateSeparatedList(fakedata);
    expect(convertedData.length).toBe(1);

    expect(spy).toHaveBeenCalledTimes(5);
  });

  it('setListsName() should set list names', () => {

    const fakedata: ViewDateSeparatedList[] = [
      {
        name: '',
        date: '2020-12-1' as ISODate
      } as unknown as ViewDateSeparatedList,
      {
        name: '',
        date: '2020-12-3' as ISODate
      } as unknown as ViewDateSeparatedList,
    ];

    component = fixture.componentInstance;

    component.setListsName(fakedata);

    expect(fakedata[0].name).not.toBe('');
    expect(fakedata[1].name).not.toBe('');
  });

  it('setListItemName() should return a string with the reamining time from the deadline', () => {

    component = fixture.componentInstance;

    let deadline = component.setListItemName(moment('2020-12-12', 'YYYY-MM-DD').format());
    expect(deadline).not.toBe('2020-12-12');
    expect(deadline).toBe('5 hónap múlva');

    deadline = component.setListItemName('');
    expect(deadline).toBe('Határidő nélküli feladatok');
  });

  it('open() should open a casefile', () => {
    const fake = { id: 0 as ID } as unknown as CasefileInterface;
    component = fixture.componentInstance;
    component.originalData.push(fake);

    const spy = spyOn(component.openCasefile, 'emit');
    component.open(fake);

    expect(spy).toHaveBeenCalledWith(fake);
  });

  it('delete() should open a casefile', () => {
    const fake = { id: 0 as ID } as unknown as CasefileInterface;
    component = fixture.componentInstance;
    component.originalData.push(fake);

    const spy = spyOn(component.deleteCasefile, 'emit');
    component.delete(fake);

    expect(spy).toHaveBeenCalledWith(fake);
  });

});
