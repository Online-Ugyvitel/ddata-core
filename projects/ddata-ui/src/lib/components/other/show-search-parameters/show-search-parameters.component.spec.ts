import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShowSearchParametersComponent } from './show-search-parameters.component';

xdescribe('ShowSearchParametersComponent', () => {
  let component: ShowSearchParametersComponent;
  let fixture: ComponentFixture<ShowSearchParametersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSearchParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSearchParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
