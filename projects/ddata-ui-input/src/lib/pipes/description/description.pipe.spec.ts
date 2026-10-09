import { DescriptionPipe } from './description.pipe';

describe('DescriptionPipe', () => {
  let pipe: DescriptionPipe;

  beforeEach(() => {
    pipe = new DescriptionPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('it should be string with one space', () => {
    expect(pipe.transform(null)).toBe(' ');
    expect(pipe.transform(undefined)).toBe(' ');
  });

  it('it should be telephone number', () => {
    expect(pipe.transform('tel:+03441314')).toBe(
      '<a href="tel:+03441314" class="mr-3">+03441314</a> '
    );
  });

  it('it should be email', () => {
    expect(pipe.transform('email:test@email.com')).toBe(
      '<a href="mailto:test@email.com" class="mr-3">test@email.com</a> '
    );
  });

  it('it should be url', () => {
    expect(pipe.transform('url:http://www.test.com')).toBe(
      '<a href="http://www.test.com" class="mr-3" target="_blank">http://www.test.com</a> '
    );
  });

  it('it should be description', () => {
    expect(pipe.transform('description: testbla')).toBe(
      '<span class="description"> testbla</span> '
    );
  });

  it('it should be unrecognized', () => {
    expect(pipe.transform('plain text test')).toBe('plain text test ');
  });

  it('it should handle empty string', () => {
    expect(pipe.transform('')).toBe(' ');
  });

  it('it should handle multiple pipe-separated values', () => {
    expect(pipe.transform('tel:+123|email:test@test.com')).toBe(
      '<a href="tel:+123" class="mr-3">+123</a> <a href="mailto:test@test.com" class="mr-3">test@test.com</a> '
    );
  });

  it('it should handle mixed content with pipes', () => {
    expect(pipe.transform('plain text|tel:+123|more text')).toBe(
      'plain text <a href="tel:+123" class="mr-3">+123</a> more text '
    );
  });

  it('it should handle malformed prefixes', () => {
    expect(pipe.transform('tel:')).toBe('<a href="tel:" class="mr-3"></a> ');
    expect(pipe.transform('email:')).toBe('<a href="mailto:" class="mr-3"></a> ');
    expect(pipe.transform('url:')).toBe('<a href="" class="mr-3" target="_blank"></a> ');
    expect(pipe.transform('description:')).toBe('<span class="description"></span> ');
  });

  it('it should handle strings with only pipes', () => {
    expect(pipe.transform('||')).toBe('   ');
  });

  it('it should handle whitespace-only strings', () => {
    expect(pipe.transform('   ')).toBe('    ');
  });

  it('it should handle complex mixed content', () => {
    expect(
      pipe.transform(
        'Contact info|tel:+36123456789|email:user@domain.com|url:https://example.com|description:Main office'
      )
    ).toBe(
      'Contact info <a href="tel:+36123456789" class="mr-3">+36123456789</a> <a href="mailto:user@domain.com" class="mr-3">user@domain.com</a> <a href="https://example.com" class="mr-3" target="_blank">https://example.com</a> <span class="description">Main office</span> '
    );
  });
});
