import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DdataUiNoDataComponent } from './no-data.component';
import { ModuleConfiguration } from '../../models/module-configuration/module-configuration.interface';

describe('DdataUiNoDataComponent', () => {
  let component: DdataUiNoDataComponent;
  let fixture: ComponentFixture<DdataUiNoDataComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
    );
  });

  describe('with default English config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ DdataUiNoDataComponent ]
      })
      .compileComponents();

      fixture = TestBed.createComponent(DdataUiNoDataComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with English i18n', () => {
      expect(component.i18n).toBeDefined();
      expect(component.i18n.article_vowel.label).toBe('The');
      expect(component.i18n.article_consonant.label).toBe('The');
    });

    it('should set article to vowel article by default', () => {
      expect(component.article).toBe('The');
    });

    it('should have empty sentence by default', () => {
      expect(component.sentence).toBe('');
    });

    it('should set randomIcon from icons array', () => {
      expect(component.icons).toContain(component.randomIcon);
    });

    it('should have 12 icons in the icons array', () => {
      expect(component.icons.length).toBe(12);
    });

    it('should set _text when text input is set', () => {
      component.text = 'test text';
      expect(component._text).toBe('test text');
    });

    it('should maintain vowel article for English language when text is set', () => {
      component.text = 'apple';
      expect(component.article).toBe('The');
    });

    it('should call ngOnInit without errors', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('with Hungarian config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ DdataUiNoDataComponent ],
        providers: [
          { provide: 'config', useValue: { lang: 'hu' } }
        ]
      })
      .compileComponents();

      fixture = TestBed.createComponent(DdataUiNoDataComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize with Hungarian i18n', () => {
      expect(component.i18n).toBeDefined();
      expect(component.i18n.article_vowel.label).toBe('A');
      expect(component.i18n.article_consonant.label).toBe('Az');
    });

    it('should set article to vowel article by default', () => {
      expect(component.article).toBe('A');
    });

    it('should keep vowel article for text starting with vowel', () => {
      component.text = 'alma';
      expect(component.article).toBe('A');
    });

    it('should set consonant article for text starting with consonant', () => {
      component.text = 'kutya';
      expect(component.article).toBe('Az');
    });

    it('should keep vowel article for text starting with accented vowel', () => {
      component.text = 'árvíz';
      expect(component.article).toBe('A');
    });

    it('should keep vowel article for text starting with uppercase vowel', () => {
      component.text = 'Alma';
      expect(component.article).toBe('A');
    });

    it('should keep vowel article for text starting with uppercase accented vowel', () => {
      component.text = 'Árva';
      expect(component.article).toBe('A');
    });

    it('should set consonant article for text starting with consonant (uppercase)', () => {
      component.text = 'Kutya';
      expect(component.article).toBe('Az');
    });

    it('should handle all Hungarian vowels correctly', () => {
      const vowels = ['a', 'á', 'e', 'é', 'i', 'í', 'o', 'ó', 'ö', 'ő', 'u', 'ú', 'ü', 'ű'];
      vowels.forEach(vowel => {
        component.text = vowel + 'test';
        expect(component.article).toBe('A');
      });
    });

    it('should handle all Hungarian uppercase vowels correctly', () => {
      const vowels = ['A', 'Á', 'E', 'É', 'I', 'Í', 'O', 'Ó', 'Ö', 'Ő', 'U', 'Ú', 'Ü', 'Ű'];
      vowels.forEach(vowel => {
        component.text = vowel + 'test';
        expect(component.article).toBe('A');
      });
    });

    it('should handle text not starting with vowel correctly', () => {
      component.text = 'berakás';
      expect(component.article).toBe('Az');
    });

    it('should handle empty text correctly', () => {
      component.text = '';
      expect(component._text).toBe('');
      // Article should remain at default vowel article
      expect(component.article).toBe('A');
    });

    it('should handle text starting with numbers correctly', () => {
      component.text = '123 teszt';
      expect(component.article).toBe('Az');
    });

    it('should handle text starting with special characters correctly', () => {
      component.text = '@mention';
      expect(component.article).toBe('Az');
    });
  });

  describe('text setter edge cases', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ DdataUiNoDataComponent ],
        providers: [
          { provide: 'config', useValue: { lang: 'hu' } }
        ]
      })
      .compileComponents();

      fixture = TestBed.createComponent(DdataUiNoDataComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should handle null/undefined text gracefully in Hungarian', () => {
      // Testing with undefined
      component.text = undefined as any;
      expect(component._text).toBeUndefined();
      
      // Testing with null
      component.text = null as any;
      expect(component._text).toBeNull();
    });

    it('should handle single character Hungarian vowels', () => {
      component.text = 'a';
      expect(component.article).toBe('A');
      
      component.text = 'á';
      expect(component.article).toBe('A');
    });

    it('should handle single character Hungarian consonants', () => {
      component.text = 'b';
      expect(component.article).toBe('Az');
      
      component.text = 'c';
      expect(component.article).toBe('Az');
    });
  });

  describe('constructor', () => {
    it('should select randomIcon from available icons', () => {
      const component1 = new DdataUiNoDataComponent();
      const component2 = new DdataUiNoDataComponent();
      
      // Both icons should be from the icons array
      expect(component1.icons).toContain(component1.randomIcon);
      expect(component2.icons).toContain(component2.randomIcon);
    });

    it('should have all required FontAwesome icons in icons array', () => {
      const component = new DdataUiNoDataComponent();
      expect(component.icons.length).toBe(12);
      // Verify that icons array contains actual icon objects
      component.icons.forEach(icon => {
        expect(icon).toBeDefined();
        expect(typeof icon).toBe('object');
      });
    });
  });

  describe('sentence input', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ DdataUiNoDataComponent ]
      })
      .compileComponents();

      fixture = TestBed.createComponent(DdataUiNoDataComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should set sentence property', () => {
      component.sentence = 'Custom sentence';
      expect(component.sentence).toBe('Custom sentence');
    });

    it('should allow empty sentence', () => {
      component.sentence = '';
      expect(component.sentence).toBe('');
    });

    it('should have sentence as Input property', () => {
      // Test that sentence can be set from template binding
      const newSentence = 'Test sentence from binding';
      component.sentence = newSentence;
      fixture.detectChanges();
      expect(component.sentence).toBe(newSentence);
    });
  });
});
