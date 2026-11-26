import { ValidatorService } from '../../services/validator/validator.service';
import { DEFAULT_VALIDATION_MESSAGES } from './validation-messages.const';

describe('DEFAULT_VALIDATION_MESSAGES', () => {
  // the rule list is read from the compiled switch of the ValidatorService, so it cannot drift from validate()
  const validatorSource: string = ValidatorService.prototype['checkRule'].toString();
  const caseLabels: Array<string> = [];
  const caseRegExp = /case\s+['"]([a-z_]+)['"]\s*:/g;
  let match = caseRegExp.exec(validatorSource);

  while (match !== null) {
    caseLabels.push(match[1]);
    match = caseRegExp.exec(validatorSource);
  }

  it('should read the rule list of the ValidatorService', () => {
    expect(caseLabels).toContain('required');
    expect(caseLabels).toContain('min');
  });

  it('should have exactly the rule keys of ValidatorService.validate plus invalid', () => {
    const expected = caseLabels.filter((label) => label !== 'nullable').concat('invalid');

    expect(Object.keys(DEFAULT_VALIDATION_MESSAGES).sort()).toEqual([...expected].sort());
  });

  it('should have an imperative Hungarian sentence ending with a full stop for every key', () => {
    Object.values(DEFAULT_VALIDATION_MESSAGES).forEach((message) => {
      expect(message.endsWith('.')).toBe(true);
      expect(message.startsWith('Hiba')).toBe(false);
    });
  });

  it('should use the same default for the required and not_empty rules', () => {
    expect(DEFAULT_VALIDATION_MESSAGES['required']).toBe('A mező kitöltése kötelező.');
    expect(DEFAULT_VALIDATION_MESSAGES['not_empty']).toBe(DEFAULT_VALIDATION_MESSAGES['required']);
  });

  it('should use the generic format message for the pattern rules and invalid', () => {
    [
      'name',
      'lang',
      'register_number',
      'driving_licence',
      'id_card_number',
      'address_card_number',
      'bankaccount',
      'taxnumber',
      'person_taxnumber',
      'social_insurance_number',
      'iban_code',
      'swift_code',
      'invalid'
    ].forEach((key) => {
      expect(DEFAULT_VALIDATION_MESSAGES[key]).toBe('Az érték formátuma nem megfelelő.');
    });
  });

  it('should be immutable', () => {
    expect(Object.isFrozen(DEFAULT_VALIDATION_MESSAGES)).toBe(true);
  });
});
