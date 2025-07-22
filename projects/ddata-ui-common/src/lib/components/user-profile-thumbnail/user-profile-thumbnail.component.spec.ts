import 'zone.js/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DdataUiCommonModule } from '../../ddata-ui-common.module';
import { DdataUiUserThumbnailComponent } from './user-profile-thumbnail.component';

describe('DdataUiUserThumbnailComponent', () => {
  let component: DdataUiUserThumbnailComponent;
  let fixture: ComponentFixture<DdataUiUserThumbnailComponent>;
  let debugElement;
  let element;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdataUiUserThumbnailComponent],
      providers: [
        Injector
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    DdataUiCommonModule.InjectorInstance = TestBed;
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

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
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
      component.user = userWithImageNoSrc;
      
      expect(component.firstLetter).toBe('B');
      expect(component.imageSrc).toBe('');
      expect(component.user).toBe(userWithImageNoSrc);
    });

    it('should set firstLetter from user name and empty imageSrc when user has image with empty src', () => {
      const userWithEmptySrc = { name: 'Carol Brown', image: { src: '' } };
      component.user = userWithEmptySrc;
      
      expect(component.firstLetter).toBe('C');
      expect(component.imageSrc).toBe('');
      expect(component.user).toBe(userWithEmptySrc);
    });

    it('should set firstLetter from user name and imageSrc when user has valid image', () => {
      const userWithImage = { name: 'David Johnson', image: { src: 'https://example.com/avatar.jpg' } };
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
});
