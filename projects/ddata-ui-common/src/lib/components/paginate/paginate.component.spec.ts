import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginateInterface } from 'ddata-core';
import { Subject } from 'rxjs';
import { DdataUiPaginateComponent } from './paginate.component';

describe('DdataUiPaginateComponent', () => {
  let component: DdataUiPaginateComponent;
  let fixture: ComponentFixture<DdataUiPaginateComponent>;
  let paginateSubject: Subject<PaginateInterface>;

  // Mock paginate data for testing
  const mockPaginateData: PaginateInterface = {
    current_page: 2,
    per_page: 10,
    from: 11,
    to: 20,
    total: 100,
    last_page: 10,
    data: []
  };

  const mockSinglePageData: PaginateInterface = {
    current_page: 1,
    per_page: 10,
    from: 1,
    to: 5,
    total: 5,
    last_page: 1,
    data: []
  };

  const mockFirstPageData: PaginateInterface = {
    current_page: 1,
    per_page: 10,
    from: 1,
    to: 10,
    total: 100,
    last_page: 10,
    data: []
  };

  const mockLastPageData: PaginateInterface = {
    current_page: 10,
    per_page: 10,
    from: 91,
    to: 100,
    total: 100,
    last_page: 10,
    data: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DdataUiPaginateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataUiPaginateComponent);
    component = fixture.componentInstance;
    paginateSubject = new Subject<PaginateInterface>();
    
    // Set up component with paginate Subject
    component.paginate = paginateSubject;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.previousText).toBe('Previous');
    expect(component.nextText).toBe('Next');
    expect(component.paginatorText).toBe('Paginator');
    expect(component.currentPage).toBe(0);
  });

  it('should allow custom input values', () => {
    component.previousText = 'Back';
    component.nextText = 'Forward';
    component.paginatorText = 'Navigation';
    
    expect(component.previousText).toBe('Back');
    expect(component.nextText).toBe('Forward');
    expect(component.paginatorText).toBe('Navigation');
  });

  describe('ngOnInit', () => {
    it('should initialize numbers observable and set currentPage', (done) => {
      component.ngOnInit();
      
      // Subscribe to numbers observable
      component.numbers.subscribe(numbers => {
        expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(component.currentPage).toBe(2);
        done();
      });

      // Emit test data
      paginateSubject.next(mockPaginateData);
    });

    it('should handle single page data correctly', (done) => {
      component.ngOnInit();
      
      component.numbers.subscribe(numbers => {
        expect(numbers).toEqual([1]);
        expect(component.currentPage).toBe(1);
        done();
      });

      paginateSubject.next(mockSinglePageData);
    });

    it('should generate correct numbers array for first page', (done) => {
      component.ngOnInit();
      
      component.numbers.subscribe(numbers => {
        expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(component.currentPage).toBe(1);
        done();
      });

      paginateSubject.next(mockFirstPageData);
    });

    it('should generate correct numbers array for last page', (done) => {
      component.ngOnInit();
      
      component.numbers.subscribe(numbers => {
        expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(component.currentPage).toBe(10);
        done();
      });

      paginateSubject.next(mockLastPageData);
    });
  });

  describe('swithPage', () => {
    beforeEach(() => {
      component.currentPage = 5;
      spyOn(component.changePage, 'emit');
    });

    it('should emit next page number when direction is next', () => {
      component.swithPage('next');
      expect(component.changePage.emit).toHaveBeenCalledWith(6);
    });

    it('should emit previous page number when direction is prev', () => {
      component.swithPage('prev');
      expect(component.changePage.emit).toHaveBeenCalledWith(4);
    });

    it('should handle edge case when current page is 1 and direction is prev', () => {
      component.currentPage = 1;
      component.swithPage('prev');
      expect(component.changePage.emit).toHaveBeenCalledWith(0);
    });

    it('should handle edge case when current page is last and direction is next', () => {
      component.currentPage = 10;
      component.swithPage('next');
      expect(component.changePage.emit).toHaveBeenCalledWith(11);
    });
  });

  describe('changePage event emitter', () => {
    it('should be defined and be an EventEmitter', () => {
      expect(component.changePage).toBeDefined();
      expect(component.changePage.emit).toBeDefined();
    });

    it('should emit page number when called directly', () => {
      spyOn(component.changePage, 'emit');
      component.changePage.emit(5);
      expect(component.changePage.emit).toHaveBeenCalledWith(5);
    });
  });

  describe('integration tests', () => {
    it('should update currentPage when paginate data changes', () => {
      component.ngOnInit();
      
      // Initial state
      expect(component.currentPage).toBe(0);
      
      // Emit first page data
      paginateSubject.next(mockFirstPageData);
      expect(component.currentPage).toBe(1);
      
      // Emit different page data
      paginateSubject.next(mockLastPageData);
      expect(component.currentPage).toBe(10);
    });

    it('should handle multiple subscribers to numbers observable', (done) => {
      component.ngOnInit();
      
      let subscription1Called = false;
      let subscription2Called = false;
      
      component.numbers.subscribe(numbers => {
        subscription1Called = true;
        expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });
      
      component.numbers.subscribe(numbers => {
        subscription2Called = true;
        expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        
        if (subscription1Called && subscription2Called) {
          done();
        }
      });

      paginateSubject.next(mockPaginateData);
    });

    it('should work correctly when paginate subject emits multiple times', () => {
      component.ngOnInit();
      
      // First emission
      paginateSubject.next(mockFirstPageData);
      expect(component.currentPage).toBe(1);
      
      // Second emission
      paginateSubject.next(mockPaginateData);
      expect(component.currentPage).toBe(2);
      
      // Third emission
      paginateSubject.next(mockLastPageData);
      expect(component.currentPage).toBe(10);
    });
  });

  describe('edge cases', () => {
    it('should handle paginate data with zero last_page', (done) => {
      const zeroPageData: PaginateInterface = {
        current_page: 0,
        per_page: 10,
        from: 0,
        to: 0,
        total: 0,
        last_page: 0,
        data: []
      };
      
      component.ngOnInit();
      
      component.numbers.subscribe(numbers => {
        expect(numbers).toEqual([]);
        expect(component.currentPage).toBe(0);
        done();
      });

      paginateSubject.next(zeroPageData);
    });

    it('should handle paginate data with negative values gracefully', (done) => {
      const negativePageData: PaginateInterface = {
        current_page: -1,
        per_page: 10,
        from: 0,
        to: 0,
        total: 0,
        last_page: -1,
        data: []
      };
      
      component.ngOnInit();
      
      component.numbers.subscribe(numbers => {
        expect(numbers).toEqual([]);
        expect(component.currentPage).toBe(-1);
        done();
      });

      paginateSubject.next(negativePageData);
    });
  });
});
