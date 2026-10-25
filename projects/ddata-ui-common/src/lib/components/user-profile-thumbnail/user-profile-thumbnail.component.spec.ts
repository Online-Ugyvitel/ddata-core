import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { DdataUiCommonModule } from '../../ddata-ui-common.module';
import { DdataUiUserThumbnailComponent } from './user-profile-thumbnail.component';

describe('DdataUiUserThumbnailComponent', () => {
  let component: DdataUiUserThumbnailComponent;
  let fixture: ComponentFixture<DdataUiUserThumbnailComponent>;
  let debugElement;
  let element;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdataUiUserThumbnailComponent],
      providers: [Injector]
    }).compileComponents();
  });

  beforeEach(() => {
    DdataUiCommonModule.InjectorInstance = {
      get: (token: never) => TestBed.inject(token)
    };
    fixture = TestBed.createComponent(DdataUiUserThumbnailComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('user setter', () => {
    it('should set default values when user is null', () => {
      component.user = null;

      expect(component.firstLetter).toBe('X');
      expect(component.imageSrc).toBe('');
      expect(component.user.name).toBe('X');
      expect(component.user.image).toBe(null);
    });

    it('should set default values when user is undefined', () => {
      component.user = undefined;

      expect(component.firstLetter).toBe('X');
      expect(component.imageSrc).toBe('');
      expect(component.user.name).toBe('X');
      expect(component.user.image).toBe(null);
    });

    it('should set firstLetter from user name and empty imageSrc when user has no image', () => {
      const userWithoutImage = { name: 'John Doe' };

      component.user = userWithoutImage;

      expect(component.firstLetter).toBe('J');
      expect(component.imageSrc).toBe('');
      expect(component.user).toBe(userWithoutImage);
    });

    it('should set firstLetter from user name and empty imageSrc when user has null image', () => {
      const userWithNullImage = { name: 'Alice Smith', image: null };

      component.user = userWithNullImage;

      expect(component.firstLetter).toBe('A');
      expect(component.imageSrc).toBe('');
      expect(component.user).toBe(userWithNullImage);
    });

    it('should set firstLetter from user name and empty imageSrc when user has image without src', () => {
      const userWithImageNoSrc = { name: 'Bob Wilson', image: {} };

      component.user = userWithImageNoSrc as never;

      expect(component.firstLetter).toBe('B');
      expect(component.imageSrc).toBe('');
      expect(component.user).toBe(userWithImageNoSrc);
    });

    it('should set firstLetter from user name and empty imageSrc when user has image with empty src', () => {
      const userWithEmptySrc = { name: 'Carol Brown', image: { src: '' } } as never;

      component.user = userWithEmptySrc;

      expect(component.firstLetter).toBe('C');
      expect(component.imageSrc).toBe('');
      expect(component.user).toBe(userWithEmptySrc);
    });

    it('should set firstLetter from user name and imageSrc when user has valid image', () => {
      const userWithImage = {
        name: 'David Johnson',
        image: { src: 'https://example.com/avatar.jpg' }
      };

      component.user = userWithImage;

      expect(component.firstLetter).toBe('D');
      expect(component.imageSrc).toBe('https://example.com/avatar.jpg');
      expect(component.user).toBe(userWithImage);
    });

    it('should handle single character names', () => {
      const userWithSingleChar = { name: 'X' };

      component.user = userWithSingleChar;

      expect(component.firstLetter).toBe('X');
      expect(component.user).toBe(userWithSingleChar);
    });

    it('should convert first letter to uppercase', () => {
      const userWithLowercase = { name: 'jane doe' };

      component.user = userWithLowercase;

      expect(component.firstLetter).toBe('J');
      expect(component.user).toBe(userWithLowercase);
    });

    it('should handle empty name by taking first character', () => {
      const userWithEmptyName = { name: '' };

      component.user = userWithEmptyName;

      expect(component.firstLetter).toBe('');
      expect(component.user).toBe(userWithEmptyName);
    });

    it('should handle names with special characters', () => {
      const userWithSpecialChars = { name: '@john' };

      component.user = userWithSpecialChars;

      expect(component.firstLetter).toBe('@');
      expect(component.user).toBe(userWithSpecialChars);
    });

    it('should handle names with numbers', () => {
      const userWithNumbers = { name: '123user' };

      component.user = userWithNumbers;

      expect(component.firstLetter).toBe('1');
      expect(component.user).toBe(userWithNumbers);
    });

    it('should handle names with spaces at the beginning', () => {
      const userWithSpaces = { name: ' Mary' };

      component.user = userWithSpaces;

      expect(component.firstLetter).toBe(' ');
      expect(component.user).toBe(userWithSpaces);
    });

    it('should handle very long names correctly', () => {
      const userWithLongName = { name: 'VeryLongNameThatGoesOnAndOnAndOn' };

      component.user = userWithLongName;

      expect(component.firstLetter).toBe('V');
      expect(component.user).toBe(userWithLongName);
    });

    it('should handle names with only whitespace', () => {
      const userWithWhitespace = { name: '   ' };

      component.user = userWithWhitespace;

      expect(component.firstLetter).toBe(' ');
      expect(component.user).toBe(userWithWhitespace);
    });
  });

  describe('user getter', () => {
    it('should return the current user object', () => {
      const testUser = { name: 'Test User', image: { src: 'test.jpg' } };

      component.user = testUser;

      expect(component.user).toBe(testUser);
    });

    it('should return default user object initially', () => {
      expect(component.user.name).toBe('X');
      expect(component.user.image).toBe(null);
    });
  });

  describe('initial state', () => {
    it('should have default firstLetter as X', () => {
      expect(component.firstLetter).toBe('X');
    });

    it('should have default imageSrc as empty string', () => {
      expect(component.imageSrc).toBe('');
    });
  });

  describe('constructor', () => {
    it('should create component instance without errors', () => {
      expect(() => new DdataUiUserThumbnailComponent()).not.toThrow();
    });
  });

  describe('component integration', () => {
    it('should maintain consistent state after multiple user assignments', () => {
      const user1 = { name: 'Alice', image: { src: 'alice.jpg' } };
      const user2 = { name: 'Bob' };

      component.user = user1;

      expect(component.user).toBe(user1);
      expect(component.firstLetter).toBe('A');
      expect(component.imageSrc).toBe('alice.jpg');

      component.user = user2;

      expect(component.user).toBe(user2);
      expect(component.firstLetter).toBe('B');
      expect(component.imageSrc).toBe('');
    });

    it('should handle complete image interface scenarios', () => {
      const userWithCompleteImage = {
        name: 'Test User',
        image: { src: 'complete-test.jpg' }
      };

      component.user = userWithCompleteImage;

      expect(component.firstLetter).toBe('T');
      expect(component.imageSrc).toBe('complete-test.jpg');
      expect(component.user.image.src).toBe('complete-test.jpg');
    });
  });

  describe('initials edge cases', () => {
    it.each([
      ['undefined', undefined],
      ['null', null]
    ])('should use an empty initial when the name is %s', (_label, name) => {
      component.user = { name };

      expect(component.firstLetter).toBe('');
    });

    it.each([
      ['Ádám', 'Á'],
      ['éva', 'É'],
      ['őrs', 'Ő'],
      ['ürge', 'Ü'],
      ['ßtraße', 'SS'],
      ['A\u0301gnes', 'Á'],
      ['😀 Smiley', '😀'],
      ['𝒜lice', '𝒜']
    ])('should take the whole first character of %s', (name: string, expected: string) => {
      component.user = { name };

      expect(component.firstLetter).toBe(expected);
    });
  });

  describe('template', () => {
    const render = (user: unknown): HTMLElement => {
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      return element.querySelector('.user-profile-thumbnail');
    };

    it('should render the image with the user name as alt and title', () => {
      const thumbnail = render({
        name: 'Kovács Éva',
        image: { src: 'https://example.com/eva.png' }
      });
      const image = thumbnail.querySelector('img');

      expect(image.getAttribute('src')).toBe('https://example.com/eva.png');
      expect(image.getAttribute('alt')).toBe('Kovács Éva');
      expect(thumbnail.getAttribute('title')).toBe('Kovács Éva');
      expect(thumbnail.textContent.trim()).toBe('');
    });

    it('should render the initial instead of an image when the image URL is missing', () => {
      const thumbnail = render({ name: 'éva', image: { src: '' } });

      expect(thumbnail.querySelector('img')).toBeNull();
      expect(thumbnail.textContent.trim()).toBe('É');
    });

    it('should render the initial in black on yellow, independent of the inherited colour', () => {
      fixture.nativeElement.style.color = 'rgb(222, 226, 230)';
      const thumbnail = render({ name: 'éva', image: { src: '' } });
      const style = getComputedStyle(thumbnail);

      expect(style.color).toBe('rgb(0, 0, 0)');
      expect(style.backgroundColor).toBe('rgb(255, 187, 17)');
    });

    it('should render the default initial when the user is missing', () => {
      const thumbnail = render(null);

      expect(thumbnail.querySelector('img')).toBeNull();
      expect(thumbnail.textContent.trim()).toBe('X');
      expect(thumbnail.getAttribute('title')).toBe('X');
    });

    it('should render no initial and no title when the name is empty', () => {
      const thumbnail = render({ name: '' });

      expect(thumbnail.querySelector('img')).toBeNull();
      expect(thumbnail.textContent.trim()).toBe('');
      expect(thumbnail.getAttribute('title')).toBe('');
    });

    it('should render an emoji initial', () => {
      expect(render({ name: '🚀 Rocket' }).textContent.trim()).toBe('🚀');
    });

    it('should keep the image element for a broken image URL (the browser shows its fallback)', () => {
      const thumbnail = render({ name: 'Broken', image: { src: 'not a valid url' } });
      const image = thumbnail.querySelector('img');

      image.dispatchEvent(new Event('error'));
      fixture.detectChanges();

      expect(thumbnail.querySelector('img')).toBe(image);
      expect(image.getAttribute('src')).toBe('not a valid url');
    });

    it('should switch between image and initial when the user changes', () => {
      const thumbnail = render({ name: 'Alice', image: { src: 'alice.png' } });

      expect(thumbnail.querySelector('img')).not.toBeNull();

      render({ name: 'bob' });

      expect(thumbnail.querySelector('img')).toBeNull();
      expect(thumbnail.textContent.trim()).toBe('B');
    });
  });
});
