import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DdataUiConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DdataUiModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { DdataUiDialogModule } from './ddata-ui-dialog.module';

@Component({
  selector: 'dd-test-module-host',
  imports: [DdataUiDialogModule],
  template: `
    <dd-confirm-dialog title="Confirm" content="Sure?" [showDialog]="true"></dd-confirm-dialog>
    <dd-modal-dialog title="Modal" [showDialog]="true"></dd-modal-dialog>
  `
})
class TestModuleHostComponent {}

describe('DdataUiDialogModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DdataUiDialogModule, TestModuleHostComponent] });
  });

  it('should be importable into a testing module', () => {
    expect(TestBed.inject(DdataUiDialogModule)).toBeInstanceOf(DdataUiDialogModule);
  });

  it('should export both dialog components to an importing component', () => {
    const fixture = TestBed.createComponent(TestModuleHostComponent);

    fixture.detectChanges();
    const confirm = fixture.debugElement.query(By.directive(DdataUiConfirmDialogComponent));
    const modal = fixture.debugElement.query(By.directive(DdataUiModalDialogComponent));

    expect(confirm.componentInstance).toBeInstanceOf(DdataUiConfirmDialogComponent);
    expect(modal.componentInstance).toBeInstanceOf(DdataUiModalDialogComponent);
    expect(confirm.nativeElement.querySelector('.modal-title').textContent.trim()).toBe('Confirm');
    expect(modal.nativeElement.querySelector('.modal-title').textContent.trim()).toBe('Modal');
    // the default content of the modal dialog comes from the module's ddata-ui-common import
    expect(modal.nativeElement.querySelector('.modal-body dd-no-data')).not.toBeNull();
  });
});
