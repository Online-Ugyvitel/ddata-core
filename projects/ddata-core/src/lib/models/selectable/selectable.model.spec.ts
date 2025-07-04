import { Selectable } from './selectable.model';
import { SelectableInterface } from './selectable.interface';

describe('Selectable', () => {

  it('should be created', () => {
    const model = new Selectable();
    expect(model).toBeTruthy();
  });

  it('should be created as a correct type', () => {
    const model = new Selectable();
    expect(model).toBeInstanceOf(Selectable);
    expect(model).toEqual(jasmine.objectContaining({} as SelectableInterface));
  });

  it('should implement SelectableInterface', () => {
    const model = new Selectable();
    // Check that the model implements the interface by having all required properties
    const selectableInterface: SelectableInterface = model;
    expect(selectableInterface).toBeDefined();
  });

  it('should have all required properties', () => {
    const model = new Selectable();
    expect(model.hasOwnProperty('is_selected')).toBe(true);
  });

  it('should have is_selected property with correct type and default value', () => {
    const model = new Selectable();
    expect(typeof model.is_selected).toBe('boolean');
    expect(model.is_selected).toBe(false);
  });

  it('should allow is_selected property to be set to true', () => {
    const model = new Selectable();
    model.is_selected = true;
    expect(model.is_selected).toBe(true);
    expect(typeof model.is_selected).toBe('boolean');
  });

  it('should allow is_selected property to be set to false', () => {
    const model = new Selectable();
    model.is_selected = true; // Set to true first
    model.is_selected = false; // Then set to false
    expect(model.is_selected).toBe(false);
    expect(typeof model.is_selected).toBe('boolean');
  });

  it('should maintain type integrity when property is modified', () => {
    const model = new Selectable();
    
    // Test initial state
    expect(model.is_selected).toBe(false);
    expect(typeof model.is_selected).toBe('boolean');
    
    // Test after modification
    model.is_selected = true;
    expect(model.is_selected).toBe(true);
    expect(typeof model.is_selected).toBe('boolean');
    
    // Test after second modification
    model.is_selected = false;
    expect(model.is_selected).toBe(false);
    expect(typeof model.is_selected).toBe('boolean');
  });

});