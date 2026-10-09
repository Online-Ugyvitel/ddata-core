import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginateInterface } from 'ddata-core';
import { firstValueFrom } from 'rxjs';
import { DdataUiPaginateComponent } from './paginate.component';

describe('DdataUiPaginateComponent', () => {
  let component: DdataUiPaginateComponent;
  let fixture: ComponentFixture<DdataUiPaginateComponent>;
  const paginateOf = (currentPage: number, lastPage: number): PaginateInterface => ({
    current_page: currentPage,
    last_page: lastPage,
    per_page: 10,
    total: lastPage * 10,
    from: 1,
    to: 10,
    data: []
  });
  const render = (paginate: PaginateInterface): HTMLElement => {
    component.paginate = paginate;
    fixture.detectChanges();

    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DdataUiPaginateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataUiPaginateComponent);
    component = fixture.componentInstance;
  });

  it('should create with the default texts', () => {
    expect(component).toBeTruthy();
    expect(component.previousText).toBe('Previous');
    expect(component.nextText).toBe('Next');
    expect(component.paginatorText).toBe('Paginator');
  });

  describe('ngOnInit', () => {
    it('should list the page numbers and remember the current page', async () => {
      component.paginate = paginateOf(2, 5);

      component.ngOnInit();

      expect(await firstValueFrom(component.numbers)).toEqual([1, 2, 3, 4, 5]);
      expect(component.currentPage).toBe(2);
    });

    it('should handle a single page', async () => {
      component.paginate = paginateOf(1, 1);

      component.ngOnInit();

      expect(await firstValueFrom(component.numbers)).toEqual([1]);
    });

    it('should not list pages when there is no last page', async () => {
      component.paginate = paginateOf(0, 0);

      component.ngOnInit();

      expect(await firstValueFrom(component.numbers)).toEqual([]);
    });
  });

  describe('swithPage', () => {
    it('should emit the next and the previous page number', () => {
      const pages: Array<number> = [];

      component.changePage.subscribe((page: number) => pages.push(page));
      component.currentPage = 3;

      component.swithPage('next');
      component.swithPage('prev');

      expect(pages).toEqual([4, 2]);
    });
  });

  describe('template', () => {
    it('should render a link for every page and mark the current one', () => {
      const element = render(paginateOf(2, 3));
      const items = element.querySelectorAll('li.page-item');

      // previous + 3 pages + next
      expect(items.length).toBe(5);
      expect(items[2].classList).toContain('active');
      expect(items[0].classList).not.toContain('disabled');
      expect(items[4].classList).not.toContain('disabled');
    });

    it('should disable the previous button on the first and the next button on the last page', () => {
      const first = render(paginateOf(1, 3)).querySelectorAll('li.page-item');

      expect(first[0].classList).toContain('disabled');
      expect(first[4].classList).not.toContain('disabled');
    });

    it('should not render the navigation when there are no pages', () => {
      expect(render(paginateOf(0, 0)).querySelector('nav')).toBeNull();
    });

    it('should emit the clicked page number', () => {
      const pages: Array<number> = [];

      component.changePage.subscribe((page: number) => pages.push(page));
      const links = render(paginateOf(1, 3)).querySelectorAll<HTMLAnchorElement>('a.page-link');

      links[2].click();

      expect(pages).toEqual([2]);
    });
  });
});
