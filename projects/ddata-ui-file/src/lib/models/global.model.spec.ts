import { TestBed } from '@angular/core/testing';
import {
  faCheck,
  faCircle,
  faDotCircle,
  faPlus,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { Global } from './global.model';

describe('Global', () => {
  it('should be provided in the root injector as a single instance', () => {
    const global = TestBed.inject(Global);

    expect(global).toBeInstanceOf(Global);
    expect(TestBed.inject(Global)).toBe(global);
  });

  it('should provide the icons what the file components use', () => {
    const { icon } = new Global();

    expect(icon.plus).toBe(faPlus);
    expect(icon.trash).toBe(faTrashAlt);
    expect(icon.check).toBe(faCheck);
    expect(icon.checkedCircle).toBe(faDotCircle);
    expect(icon.circle).toBe(faCircle);
  });

  it('should provide a defined icon for every key', () => {
    const undefinedIcons = Object.entries(new Global().icon)
      .filter(([, definition]) => !definition?.icon)
      .map(([key]) => key);

    expect(undefinedIcons).toEqual([]);
  });
});
