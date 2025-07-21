import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import 'zone.js/testing';
import { DdataUiUserThumbnailComponent } from './user-profile-thumbnail.component';

describe('DdataUiUserThumbnailComponent', () => {
  let component: DdataUiUserThumbnailComponent;
  let fixture: ComponentFixture<DdataUiUserThumbnailComponent>;
  let debugElement;
  let element;

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
      teardown: { destroyAfterEach: false }
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdataUiUserThumbnailComponent],
      providers: [Injector]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiUserThumbnailComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set first letter when user is set', () => {
    const testUser = { name: 'John' };

    component.user = testUser;

    expect(component.firstLetter).toBe('J');
  });

  it('should handle user name first letter extraction', () => {
    const testUser = { name: 'Anybody' };

    component.user = testUser;

    expect(component.firstLetter).toBe('A');
  });
});
