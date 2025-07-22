import { color } from 'src/app/i18n/general.lang';
import { ElementRef, Injector, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { AppModule } from 'src/app/app.module';
import { ColorHexaCode, ID } from 'src/app/models/base-model/base-data-type.model';
import { CasefileInterface } from 'src/app/models/casefile/casefile.interface';
import { KanbanStatusInterface } from 'src/app/models/kanban/status/kanban-status.interface';
import { KanbanStatus } from 'src/app/models/kanban/status/kanban-status.model';
import 'zone.js/testing';
import { KanbanCasefile } from './../../models/kanban/casefile/kanban-casefile.model';
import { ViewKanban } from './../../models/view/kanban/view-kanban.model';
import { ViewKanbanComponent } from './view-kanban.component';

xdescribe('ViewKanbanComponent', () => {
  let component: ViewKanbanComponent;
  let fixture: ComponentFixture<ViewKanbanComponent>;

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
      declarations: [ViewKanbanComponent],
      providers: [
        Injector,
        Renderer2,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(ViewKanbanComponent);
    document.body.appendChild(fixture.nativeElement);
  });

  afterEach(() => {
    document.body.removeChild(fixture.nativeElement);
  });

  it('should create', () => {
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('setHeight() method should set height', () => {
    component = fixture.componentInstance;
    component.kanbanStatusContainer = new ElementRef(document.createElement('div'));
    component.setHeight();
    expect(component.kanbanStatusContainer.nativeElement.style.height).toBe(document.documentElement.clientHeight - 189 + 'px');
  });

  it('convertToKanban() should convert casefiles to kanban', () => {

    const fakedata = [
      {
        id: 1 as ID,
        status: {
          id: 1 as ID,
          name: 'test',
          color: '#eb4034' as ColorHexaCode
        }
      } as unknown as CasefileInterface
    ];

    fakedata[0].id = 1 as ID;
    fakedata[0].status.id = 1 as ID;
    fakedata[0].status.name = 'test';
    fakedata[0].status.color = '#eb4034' as ColorHexaCode;

    component = fixture.componentInstance;
    const dataset = component.convertToKanban(fakedata);

    expect(dataset).toBeTruthy();
    expect(dataset.statuses.length).toBe(1);
  });

  it('dragstart() method should update classlist', () => {

    const fakedata =
      {
        id: 1 as ID,
        status: {
          id: 1 as ID,
          name: 'test',
          color: '#eb4034' as ColorHexaCode
        }
      } as unknown as CasefileInterface;

    component = fixture.componentInstance;
    component.kanbanData = new ViewKanban().init();
    component.kanbanData.statuses = [new KanbanStatus().init()];

    let element = document.body.firstElementChild;
    element.classList.add('kanban-status');

    component.kanbanStatusContainer = new ElementRef(element);
    fixture.detectChanges();

    component.dragstart(fakedata, new KanbanStatus());
    expect(component.dragCasefile).toEqual(fakedata);
    expect(component.dragFromStatus).toEqual(new KanbanStatus());
    expect(element.classList).toContain('drag-active');
  });

  it('dragover() should update is_drag_over property of a kanbanstatus object', () => {
    component = fixture.componentInstance;
    component.kanbanData = new ViewKanban().init({
      statuses: [
        new KanbanStatus().init(),
        new KanbanStatus().init(),
        new KanbanStatus().init()
      ]
    });
    component.dragover(component.kanbanData.statuses[0]);
    expect(component.dragOverStatus.is_drag_over).toBeTrue();
  });

  it('dragend() method should update casefile', () => {
    const fakedata =
      {
        id: 1 as ID,
        status_id: 2 as ID,
        status: new KanbanStatus().init({
          id: 2 as ID,
          name: 'test',
          color: '#eb4034' as ColorHexaCode
        })
      } as unknown as CasefileInterface;

    component = fixture.componentInstance;
    const spy = spyOn(component.updateCasefile, 'emit');
    component.dragCasefile = fakedata;
    component.originalData.push(component.dragCasefile);

    component.dragOverStatus = new KanbanStatus().init({id: 1 as ID, casefiles: [fakedata]});
    component.dragFromStatus = new KanbanStatus().init({id: 1 as ID, casefiles: [fakedata]});

    component.dragend();
    expect(spy).toHaveBeenCalledWith(component.dragCasefile);
  });

  it('getEstimatedTimes() method should return the sum of time estimates of casefiles', () => {
    component = fixture.componentInstance;
    const fakekanban: KanbanStatusInterface = new KanbanStatus().init();

    fakekanban.casefiles = [
      new KanbanCasefile().init({estimated_time: '2:3:1'}),
      new KanbanCasefile().init({estimated_time: '3:2:1'}),
      new KanbanCasefile().init({estimated_time: '1:1:1'}),
    ];

    const times = component.getEstimatedTimes(fakekanban);
    expect(times).toBe('6ó 6p');
  });

  it('dragoverCasefile() method should update dragOverCasefileContainer', () => {
    component = fixture.componentInstance;
    const fakeCase = new KanbanCasefile();
    component.dragoverCasefile(fakeCase);
    expect(component.dragOverCasefileContainer).toBeTruthy();
    expect(component.dragOverCasefileContainer).toEqual(fakeCase);
  });
});
