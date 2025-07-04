import { Paginate } from './paginate.model';
import { PaginateInterface } from './paginate.interface';

// Mock class to test the type functionality
class MockModel {
  id: number = 0;
  name: string = '';

  init(data?: any): MockModel {
    if (data) {
      this.id = data.id || 0;
      this.name = data.name || '';
    }
    return this;
  }
}

describe('Paginate', () => {
  let mockType: any;

  beforeEach(() => {
    mockType = MockModel;
  });

  describe('Model Creation', () => {
    it('should be created with valid type parameter', () => {
      const paginate = new Paginate(mockType);
      expect(paginate).toBeTruthy();
      expect(paginate).toBeInstanceOf(Paginate);
    });

    it('should create empty instance when created without type parameter', () => {
      const paginate = new Paginate(null);
      expect(paginate).toBeInstanceOf(Paginate);
      expect(paginate.current_page).toBeUndefined();
      expect(paginate.per_page).toBeUndefined();
      expect(paginate.data).toEqual([]); // data has default value
    });

    it('should create empty instance when created with undefined type parameter', () => {
      const paginate = new Paginate(undefined);
      expect(paginate).toBeInstanceOf(Paginate);
      expect(paginate.current_page).toBeUndefined();
      expect(paginate.per_page).toBeUndefined();
      expect(paginate.data).toEqual([]); // data has default value
    });

    it('should create empty instance when created with falsy type parameter', () => {
      const paginate = new Paginate('');
      expect(paginate).toBeInstanceOf(Paginate);
      expect(paginate.current_page).toBeUndefined();
      expect(paginate.per_page).toBeUndefined();
      expect(paginate.data).toEqual([]); // data has default value
    });
  });

  describe('Type Verification', () => {
    it('should be an instance of Paginate class', () => {
      const paginate = new Paginate(mockType);
      expect(paginate).toBeInstanceOf(Paginate);
    });

    it('should implement PaginateInterface', () => {
      const paginate = new Paginate(mockType);
      expect(paginate).toEqual(jasmine.any(Object));
      // Verify it has all interface properties
      expect(paginate.hasOwnProperty('current_page')).toBe(true);
      expect(paginate.hasOwnProperty('per_page')).toBe(true);
      expect(paginate.hasOwnProperty('from')).toBe(true);
      expect(paginate.hasOwnProperty('to')).toBe(true);
      expect(paginate.hasOwnProperty('data')).toBe(true);
      expect(paginate.hasOwnProperty('total')).toBe(true);
      expect(paginate.hasOwnProperty('last_page')).toBe(true);
    });
  });

  describe('Required Properties', () => {
    let paginate: Paginate;

    beforeEach(() => {
      paginate = new Paginate(mockType);
    });

    it('should have current_page property', () => {
      expect(paginate.hasOwnProperty('current_page')).toBe(true);
      expect(paginate.current_page).toBeDefined();
    });

    it('should have per_page property', () => {
      expect(paginate.hasOwnProperty('per_page')).toBe(true);
      expect(paginate.per_page).toBeDefined();
    });

    it('should have from property', () => {
      expect(paginate.hasOwnProperty('from')).toBe(true);
      expect(paginate.from).toBeDefined();
    });

    it('should have to property', () => {
      expect(paginate.hasOwnProperty('to')).toBe(true);
      expect(paginate.to).toBeDefined();
    });

    it('should have data property', () => {
      expect(paginate.hasOwnProperty('data')).toBe(true);
      expect(paginate.data).toBeDefined();
    });

    it('should have total property', () => {
      expect(paginate.hasOwnProperty('total')).toBe(true);
      expect(paginate.total).toBeDefined();
    });

    it('should have last_page property', () => {
      expect(paginate.hasOwnProperty('last_page')).toBe(true);
      expect(paginate.last_page).toBeDefined();
    });
  });

  describe('Property Types', () => {
    let paginate: Paginate;

    beforeEach(() => {
      paginate = new Paginate(mockType);
    });

    it('should have current_page as number type', () => {
      expect(typeof paginate.current_page).toBe('number');
    });

    it('should have per_page as number type', () => {
      expect(typeof paginate.per_page).toBe('number');
    });

    it('should have from as number type', () => {
      expect(typeof paginate.from).toBe('number');
    });

    it('should have to as number type', () => {
      expect(typeof paginate.to).toBe('number');
    });

    it('should have data as array type', () => {
      expect(Array.isArray(paginate.data)).toBe(true);
    });

    it('should have total as number type', () => {
      expect(typeof paginate.total).toBe('number');
    });

    it('should have last_page as number type', () => {
      expect(typeof paginate.last_page).toBe('number');
    });
  });

  describe('Default Values', () => {
    let paginate: Paginate;

    beforeEach(() => {
      paginate = new Paginate(mockType);
    });

    it('should set default values when no data is provided', () => {
      expect(paginate.current_page).toBe(1);
      expect(paginate.per_page).toBe(1);
      expect(paginate.from).toBe(1);
      expect(paginate.to).toBe(1);
      expect(paginate.total).toBe(1);
      expect(paginate.last_page).toBe(1);
      expect(paginate.data).toEqual([]);
    });

    it('should set default values when empty data object is provided', () => {
      const paginate = new Paginate(mockType, {});
      expect(paginate.current_page).toBe(1);
      expect(paginate.per_page).toBe(1);
      expect(paginate.from).toBe(1);
      expect(paginate.to).toBe(1);
      expect(paginate.total).toBe(1);
      expect(paginate.last_page).toBe(1);
      expect(paginate.data).toEqual([]);
    });
  });

  describe('Constructor with Data Parameter', () => {
    it('should use provided data values when they are truthy', () => {
      const testData = {
        current_page: 3,
        per_page: 10,
        from: 21,
        to: 30,
        total: 100,
        last_page: 10
      };

      const paginate = new Paginate(mockType, testData);

      expect(paginate.current_page).toBe(3);
      expect(paginate.per_page).toBe(10);
      expect(paginate.from).toBe(21);
      expect(paginate.to).toBe(30);
      expect(paginate.total).toBe(100);
      expect(paginate.last_page).toBe(10);
    });

    it('should use default values when data properties are falsy', () => {
      const testData = {
        current_page: 0,
        per_page: null,
        from: undefined,
        to: false,
        total: '',
        last_page: NaN
      };

      const paginate = new Paginate(mockType, testData);

      expect(paginate.current_page).toBe(1);
      expect(paginate.per_page).toBe(1);
      expect(paginate.from).toBe(1);
      expect(paginate.to).toBe(1);
      expect(paginate.total).toBe(1);
      expect(paginate.last_page).toBe(1);
    });

    it('should handle partial data correctly', () => {
      const testData = {
        current_page: 5,
        total: 50
      };

      const paginate = new Paginate(mockType, testData);

      expect(paginate.current_page).toBe(5);
      expect(paginate.per_page).toBe(1);
      expect(paginate.from).toBe(1);
      expect(paginate.to).toBe(1);
      expect(paginate.total).toBe(50);
      expect(paginate.last_page).toBe(1);
    });
  });

  describe('Data Array Handling', () => {
    it('should initialize empty data array when no data.data is provided', () => {
      const paginate = new Paginate(mockType);
      expect(paginate.data).toEqual([]);
    });

    it('should initialize empty data array when data.data is falsy', () => {
      const testData = { data: null };
      const paginate = new Paginate(mockType, testData);
      expect(paginate.data).toEqual([]);
    });

    it('should populate data array with typed instances when data.data is provided', () => {
      const testData = {
        data: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' }
        ]
      };

      const paginate = new Paginate(mockType, testData);

      expect(paginate.data.length).toBe(2);
      expect(paginate.data[0]).toBeInstanceOf(MockModel);
      expect(paginate.data[1]).toBeInstanceOf(MockModel);
      expect(paginate.data[0].id).toBe(1);
      expect(paginate.data[0].name).toBe('Item 1');
      expect(paginate.data[1].id).toBe(2);
      expect(paginate.data[1].name).toBe('Item 2');
    });

    it('should handle empty data array correctly', () => {
      const testData = { data: [] };
      const paginate = new Paginate(mockType, testData);
      expect(paginate.data).toEqual([]);
    });

    it('should call init method on each data item', () => {
      const mockTypeWithSpy = jasmine.createSpy('MockType').and.returnValue({
        init: jasmine.createSpy('init').and.returnValue({ id: 0, name: '' })
      });

      const testData = {
        data: [{ id: 1, name: 'Test' }]
      };

      const paginate = new Paginate(mockTypeWithSpy, testData);

      expect(mockTypeWithSpy).toHaveBeenCalled();
      expect(mockTypeWithSpy().init).toHaveBeenCalledWith({ id: 1, name: 'Test' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null data parameter gracefully', () => {
      const paginate = new Paginate(mockType, null);
      expect(paginate.current_page).toBe(1);
      expect(paginate.per_page).toBe(1);
      expect(paginate.from).toBe(1);
      expect(paginate.to).toBe(1);
      expect(paginate.total).toBe(1);
      expect(paginate.last_page).toBe(1);
      expect(paginate.data).toEqual([]);
    });

    it('should handle undefined data parameter gracefully', () => {
      const paginate = new Paginate(mockType, undefined);
      expect(paginate.current_page).toBe(1);
      expect(paginate.data).toEqual([]);
    });

    it('should handle complex data structure', () => {
      const testData = {
        current_page: 2,
        per_page: 5,
        from: 6,
        to: 10,
        total: 25,
        last_page: 5,
        data: [
          { id: 6, name: 'Item 6' },
          { id: 7, name: 'Item 7' },
          { id: 8, name: 'Item 8' },
          { id: 9, name: 'Item 9' },
          { id: 10, name: 'Item 10' }
        ]
      };

      const paginate = new Paginate(mockType, testData);

      expect(paginate.current_page).toBe(2);
      expect(paginate.per_page).toBe(5);
      expect(paginate.from).toBe(6);
      expect(paginate.to).toBe(10);
      expect(paginate.total).toBe(25);
      expect(paginate.last_page).toBe(5);
      expect(paginate.data.length).toBe(5);
      expect(paginate.data[0].id).toBe(6);
      expect(paginate.data[4].id).toBe(10);
    });

    it('should handle data with items that have missing properties', () => {
      const testData = {
        data: [
          { id: 1 }, // missing name
          { name: 'Item 2' }, // missing id
          {} // missing both
        ]
      };

      const paginate = new Paginate(mockType, testData);

      expect(paginate.data.length).toBe(3);
      expect(paginate.data[0].id).toBe(1);
      expect(paginate.data[0].name).toBe('');
      expect(paginate.data[1].id).toBe(0);
      expect(paginate.data[1].name).toBe('Item 2');
      expect(paginate.data[2].id).toBe(0);
      expect(paginate.data[2].name).toBe('');
    });
  });

  describe('Type Safety and Consistency', () => {
    it('should maintain consistent types throughout lifecycle', () => {
      const testData = {
        current_page: 3,
        per_page: 15,
        from: 31,
        to: 45,
        total: 150,
        last_page: 10,
        data: [{ id: 31, name: 'Test Item' }]
      };

      const paginate = new Paginate(mockType, testData);

      // Verify types remain consistent
      expect(typeof paginate.current_page).toBe('number');
      expect(typeof paginate.per_page).toBe('number');
      expect(typeof paginate.from).toBe('number');
      expect(typeof paginate.to).toBe('number');
      expect(typeof paginate.total).toBe('number');
      expect(typeof paginate.last_page).toBe('number');
      expect(Array.isArray(paginate.data)).toBe(true);

      // Verify values are correctly assigned
      expect(paginate.current_page).toBe(3);
      expect(paginate.per_page).toBe(15);
      expect(paginate.from).toBe(31);
      expect(paginate.to).toBe(45);
      expect(paginate.total).toBe(150);
      expect(paginate.last_page).toBe(10);
      expect(paginate.data.length).toBe(1);
      expect(paginate.data[0]).toBeInstanceOf(MockModel);
    });

    it('should preserve data array type as any[]', () => {
      const paginate = new Paginate(mockType);
      expect(Array.isArray(paginate.data)).toBe(true);
      
      // Should be able to contain instances of the provided type
      const testData = { data: [{ id: 1, name: 'Test' }] };
      const paginateWithData = new Paginate(mockType, testData);
      expect(paginateWithData.data[0]).toBeInstanceOf(MockModel);
    });
  });
});