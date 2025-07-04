import { DescriptionPipe } from './description.pipe';

xdescribe('DescriptionPipe', () => {
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
    expect(pipe.transform('tel:+03441314')).toBe('<a href="tel:+03441314" class="mr-3">+03441314</a> ');
  });

  it('it should be email', () => {
    expect(pipe.transform('email:test@email.com')).toBe('<a href="mailto:test@email.com" class="mr-3">test@email.com</a> ');
  });

  it('it should be url', () => {
    expect(pipe.transform('url:http://www.test.com')).
    toBe('<a href="http://www.test.com" class="mr-3" target="_blank">http://www.test.com</a> ');
  });

  it('it should be description', () => {
    expect(pipe.transform('description: testbla')).toBe('<span class="description"> testbla</span> ');
  });

  it('it should be unrecognized', () => {
    expect(pipe.transform('plain text test')).toBe('plain text test ');
  });
});
