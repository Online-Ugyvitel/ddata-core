import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DdataUiNoDataComponent } from './no-data.component';

describe('DdataUiNoDataComponent', () => {
  let component: DdataUiNoDataComponent;
  let fixture: ComponentFixture<DdataUiNoDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DdataUiNoDataComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // This allows custom elements like fa-icon
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiNoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('icons should contain the created component', () => {
    component = new DdataUiNoDataComponent();

    expect(component.icons).toContain(component.randomIcon);
  });
});
