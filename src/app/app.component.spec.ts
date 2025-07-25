import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it(`should have as title 'ddata-lib'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.title).toEqual('ddata-lib');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.content span').textContent).toContain(
      'ddata-lib app is running!'
    );
  });
});
