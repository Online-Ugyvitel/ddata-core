import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DdataUiModalDialogComponent } from './modal-dialog.component';

xdescribe('DdataUiModalDialogComponent', () => {
  let component: DdataUiModalDialogComponent;
  let fixture: ComponentFixture<DdataUiModalDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DdataUiModalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
