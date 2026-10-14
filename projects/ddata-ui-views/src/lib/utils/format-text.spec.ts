import { formatText } from './format-text';

describe('formatText()', () => {
  it('should replace the placeholders', () => {
    expect(
      formatText('{casefile} -> {status} #{position}', { casefile: 'A', status: 'B', position: 2 })
    ).toBe('A -> B #2');
  });

  it('should keep the unknown placeholders and the text without placeholders', () => {
    expect(formatText('{unknown} {casefile}', { casefile: 'A' })).toBe('{unknown} A');
    expect(formatText('plain', {})).toBe('plain');
  });
});
