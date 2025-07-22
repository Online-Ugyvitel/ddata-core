import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DdataUiProgressbarComponent } from './progressbar.component';

describe('DdataUiProgressbarComponent', () => {
  let component: DdataUiProgressbarComponent;
  let fixture: ComponentFixture<DdataUiProgressbarComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DdataUiProgressbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiProgressbarComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.max).toBe(100);
    expect(component.current).toBe(0);
    expect(component.progress).toBe(0);
  });

  it('should calculate progress correctly when current and max are set', () => {
    component.max = 100;
    component.current = 50;
    expect(component.progress).toBe(50);
  });

  it('should calculate progress as 100 when current equals max', () => {
    component.max = 100;
    component.current = 100;
    expect(component.progress).toBe(100);
  });

  it('should handle progress calculation when max is 0', () => {
    component.max = 0;
    component.current = 50;
    expect(component.progress).toBe(0);
  });

  it('should round progress to nearest integer', () => {
    component.max = 3;
    component.current = 1;
    expect(component.progress).toBe(33); // 1/3 * 100 = 33.333... rounded to 33
  });

  it('should update progress when max property is changed', () => {
    component.current = 25;
    component.max = 50;
    expect(component.progress).toBe(50);
    
    component.max = 100;
    expect(component.progress).toBe(25);
  });

  it('should update progress when current property is changed', () => {
    component.max = 100;
    component.current = 30;
    expect(component.progress).toBe(30);
    
    component.current = 75;
    expect(component.progress).toBe(75);
  });

  it('should call calculateProgress during ngOnInit', () => {
    const spy = spyOn<any>(component, 'calculateProgress');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should render progress bar with correct width style', () => {
    component.max = 100;
    component.current = 30;
    fixture.detectChanges();
    
    const progressBar = debugElement.query(By.css('.progress-bar'));
    const style = progressBar.nativeElement.style;
    expect(style.width).toBe('31%'); // (30 + 1) / 100 * 100 = 31%
  });

  it('should add striped and animated classes when progress is less than 100', () => {
    component.max = 100;
    component.current = 50;
    fixture.detectChanges();
    
    const progressBar = debugElement.query(By.css('.progress-bar'));
    expect(progressBar.classes['progress-bar-striped']).toBeTruthy();
    expect(progressBar.classes['progress-bar-animated']).toBeTruthy();
  });

  it('should not add striped and animated classes when progress equals 100', () => {
    component.max = 100;
    component.current = 100;
    fixture.detectChanges();
    
    const progressBar = debugElement.query(By.css('.progress-bar'));
    expect(progressBar.classes['progress-bar-striped']).toBeFalsy();
    expect(progressBar.classes['progress-bar-animated']).toBeFalsy();
  });

  it('should have correct role attribute', () => {
    const progressBar = debugElement.query(By.css('.progress-bar'));
    expect(progressBar.attributes['role']).toBe('progressbar');
  });

  it('should handle edge case when current is greater than max', () => {
    component.max = 50;
    component.current = 75;
    expect(component.progress).toBe(150);
  });

  it('should handle negative current values', () => {
    component.max = 100;
    component.current = -25;
    expect(component.progress).toBe(-25);
  });

  it('should handle negative max values', () => {
    component.max = -50;
    component.current = 25;
    expect(component.progress).toBe(0); // max <= 0 case
  });

  it('should handle decimal values correctly', () => {
    component.max = 100;
    component.current = 33.33;
    expect(component.progress).toBe(33); // rounded
  });
});
