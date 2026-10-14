import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginateInterface } from '@netdjw/ddata-core';
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

  describe('edge cases', () => {
    it('should not render anything and list no pages when paginate is not set', async () => {
      fixture.detectChanges();

      expect(component._paginate).toBeUndefined();
      expect(await firstValueFrom(component.numbers)).toEqual([]);
      expect(component.currentPage).toBe(0);
      expect((fixture.nativeElement as HTMLElement).querySelector('nav')).toBeNull();
    });

    it('should fall back to page 0 and no pages when the fields are missing', async () => {
      component.paginate = {} as PaginateInterface;

      component.ngOnInit();

      expect(await firstValueFrom(component.numbers)).toEqual([]);
      expect(component.currentPage).toBe(0);
    });

    it('should not render the navigation for 0 results', () => {
      const element = render({ ...paginateOf(1, 0), total: 0, from: 0, to: 0 });

      expect(element.querySelector('nav')).toBeNull();
      expect(element.querySelectorAll('li.page-item').length).toBe(0);
    });

    it('should disable both buttons when there is only a single page', () => {
      const items = render(paginateOf(1, 1)).querySelectorAll('li.page-item');

      expect(items.length).toBe(3);
      expect(items[0].classList).toContain('disabled');
      expect(items[1].classList).toContain('active');
      expect(items[2].classList).toContain('disabled');
    });

    it('should disable the next button and enable the previous one on the last page', () => {
      const items = render(paginateOf(3, 3)).querySelectorAll('li.page-item');

      expect(items[0].classList).not.toContain('disabled');
      expect(items[3].classList).toContain('active');
      expect(items[4].classList).toContain('disabled');
    });

    it('should render every page when there are very many pages', () => {
      const element = render(paginateOf(500, 1000));
      const items = element.querySelectorAll('li.page-item');
      const active = element.querySelectorAll('li.page-item.active');

      expect(items.length).toBe(1002);
      expect(items[1].textContent.trim()).toBe('1');
      expect(items[1000].textContent.trim()).toBe('1000');
      expect(active.length).toBe(1);
      expect(active[0].textContent.trim()).toBe('500');
      expect(element.querySelectorAll('li.page-item.disabled').length).toBe(0);
    });

    it('should not mark any page active when the current page is beyond the last page', () => {
      const element = render(paginateOf(7, 3));
      const items = element.querySelectorAll('li.page-item');

      expect(element.querySelectorAll('li.page-item.active').length).toBe(0);
      expect(items[0].classList).not.toContain('disabled');
      expect(items[4].classList).toContain('disabled');
    });

    it('should not mark any page active and disable previous when the current page is negative', () => {
      const element = render(paginateOf(-1, 3));
      const items = element.querySelectorAll('li.page-item');

      expect(element.querySelectorAll('li.page-item.active').length).toBe(0);
      expect(items[0].classList).toContain('disabled');
      expect(items[4].classList).not.toContain('disabled');
    });

    it('should use the custom texts', () => {
      component.previousText = 'Előző';
      component.nextText = 'Következő';
      component.paginatorText = 'Lapozó';
      const element = render(paginateOf(1, 2));
      const links = element.querySelectorAll('a.page-link');

      expect(element.querySelector('nav').getAttribute('aria-label')).toBe('Lapozó');
      expect(links[0].textContent.trim()).toBe('Előző');
      expect(links[3].textContent.trim()).toBe('Következő');
    });

    it('should emit the neighbour pages when the previous and next buttons are clicked', () => {
      const pages: Array<number> = [];

      component.changePage.subscribe((page: number) => pages.push(page));
      const links = render(paginateOf(2, 3)).querySelectorAll<HTMLAnchorElement>('a.page-link');

      links[0].click();
      links[4].click();

      expect(pages).toEqual([1, 3]);
    });

    it('should emit every click of fast consecutive paging relative to the current input page', () => {
      const pages: Array<number> = [];

      component.changePage.subscribe((page: number) => pages.push(page));
      const links = render(paginateOf(2, 5)).querySelectorAll<HTMLAnchorElement>('a.page-link');

      links[6].click();
      links[6].click();
      links[3].click();
      links[4].click();
      links[0].click();

      // the component does not change page on its own: the parent decides by updating the input
      expect(pages).toEqual([3, 3, 3, 4, 1]);
      expect(component.currentPage).toBe(2);
    });
  });
});
