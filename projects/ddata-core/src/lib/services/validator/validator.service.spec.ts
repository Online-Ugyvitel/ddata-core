import { ValidatorService } from './validator.service';
import { ValidationError } from '../../models/error/validation-error.model';
import { ValidationErrorSettingsInterface } from '../../models/error/validation-error-settings.model';

const validator = new ValidatorService();

describe('ValidatorService', () => {
  describe('isString', () => {
  it('Should be false if parameter is null', () => {
    const result = validator.isString(null);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isString(undefined);
    expect(result).toBe(false);
  });

  it('Should be true if parameter is string', () => {
    const result = validator.isString('test');
    expect(result).toBe(true);
  });
});

describe('isNumber', () => {
  it('Should be true if parameter is number', () => {
    const result = validator.isNumber(4);
    expect(result).toBe(true);
  });

  it('Should be false if parameter is string', () => {
    const result = validator.isNumber('test');
    expect(result).toBe(false);
  });
});

describe('isBoolean', () => {
  it('Should be true if parameter is boolean', () => {
    const result = validator.isBoolean(true);
    expect(result).toBe(true);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isBoolean(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is number', () => {
    const result = validator.isBoolean(3);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is string', () => {
    const result = validator.isBoolean('test');
    expect(result).toBe(false);
  });
});

describe('isRequired', () => {
  it('Should be true if parameter is number', () => {
    const result = validator.isRequired(2);
    expect(result).toBe(true);
  });

  it('Should be true if parameter is string', () => {
    const result = validator.isRequired('test');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is udnefined', () => {
    const result = validator.isRequired(undefined);
    expect(result).toBe(false);
  });
});

describe('isInteger', () => {
  it('Should be true if parameter is number', () => {
    const result = validator.isInteger(20);
    expect(result).toBe(true);
  });

  it('Should be false if parameter is string', () => {
    const result = validator.isInteger('test');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isInteger(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isInteger(true);
    expect(result).toBe(false);
  });
});

describe('isNotZero', () => {
  it('Should be true if parameter is boolean', () => {
    const result = validator.isNotZero(true);
    expect(result).toBe(true);
  });

  it('Should be true if parameter is string', () => {
    const result = validator.isNotZero('test');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is zero', () => {
    const result = validator.isNotZero(0);
    expect(result).toBe(false);
  });
});

describe('isregisterNumber', () => {
  it('Should be true if parameter is register number', () => {
    const result = validator.isregisterNumber('12-12-123456');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is not register number', () => {
    const result = validator.isregisterNumber('123-12-123456');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is not register number', () => {
    const result = validator.isregisterNumber('1212123456');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isregisterNumber(true);
    expect(result).toBe(false);
  });
});

describe('isLang', () => {
  it('Should be true if parameter is two large letters', () => {
    const result = validator.isLang('AA');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is one large letter and one small letter', () => {
    const result = validator.isLang('Aa');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is one small letter and one large letter', () => {
    const result = validator.isLang('aA');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is two small letters', () => {
    const result = validator.isLang('aa');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is number', () => {
    const result = validator.isLang(5);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is three large letter', () => {
    const result = validator.isLang('AZZ');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is three small letter', () => {
    const result = validator.isLang('AZZ');
    expect(result).toBe(false);
  });
});

describe('isName', () => {
  it('Should be true if parameter is full name', () => {
    const result = validator.isName('Teszt Elek');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is doctoral prefix and full name', () => {
    const result = validator.isName('Dr. Teszt Elek');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is more first names', () => {
    const result = validator.isName('Teszt Elek Tamás Elemér');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is number', () => {
    const result = validator.isName(2);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is cats clow number', () => {
    const result = validator.isName('2');
    expect(result).toBe(false);
  });
});

describe('isEmail', () => {
  it('Should be true if parameter is valid email only letters', () => {
    const result = validator.isEmail('info@test.com');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid email with letters and number', () => {
    const result = validator.isEmail('info123@test.com');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is email without @', () => {
    const result = validator.isEmail('info123test.com');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is number', () => {
    const result = validator.isEmail(2);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is number', () => {
    const result = validator.isEmail(2);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isEmail(true);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isEmail(undefined);
    expect(result).toBe(false);
  });
});

describe('isDomain', () => {
  it('Should be true if parameter is valid domain name', () => {
    const result = validator.isDomain('google.com');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is domain name with number', () => {
    const result = validator.isDomain('123test.dev');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is domain name with hyphen', () => {
    const result = validator.isDomain('come-on.test');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is domain name start with hyphen', () => {
    const result = validator.isDomain('-comeon.test');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is domain name only special character', () => {
    const result = validator.isDomain('#&.com');
    expect(result).toBe(false);
  });
});

describe('isUrl', () => {
  it('Should be true if parameter is url with https://', () => {
    const result = validator.isUrl('https://www.google.com');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is url started hyphen', () => {
    const result = validator.isUrl('https://-www.google.com');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is not start http(s) ', () => {
    const result = validator.isUrl('www.google.com');
    expect(result).toBe(false);
  });
});

// describe('isSettlementName', () => {
//   it('Should be true if parameter is city', () => {
//     const result = validator.isSettlementName('Salgótarján');
//     expect(result).toBe(true);
//   });

//   it('Should be true if parameter is city with hyphen', () => {
//     const result = validator.isSettlementName('San-Marino');
//     expect(result).toBe(true);
//   });

//   it('Should be false if parameter is city with number', () => {
//     const result = validator.isSettlementName('Salgótarján1');
//     expect(result).toBe(false);
//   });

//   it('Should be false if parameter is undefined', () => {
//     const result = validator.isSettlementName(undefined);
//     expect(result).toBe(false);
//   });

//   it('Should be false if parameter is special character', () => {
//     const result = validator.isSettlementName('#');
//     expect(result).toBe(false);
//   });
// });

describe('isIsoDate', () => {
  it('Should be true if parameter is valid date', () => {
    const result = validator.isIsoDate('2020.01.01');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid date with per sign', () => {
    const result = validator.isIsoDate('2020/01/01');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid date with hyphen', () => {
    const result = validator.isIsoDate('2020-01-01');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is date with more numbers', () => {
    const result = validator.isIsoDate('2020-01-012');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is strings', () => {
    const result = validator.isIsoDate('abcd-ab-ab');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isIsoDate(true);
    expect(result).toBe(false);
  });
});

describe('isDrivingLicencce', () => {
  it('Should be true if parameter is valid driving licence', () => {
    const result = validator.isDrivingLicence('AA123456');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is more numbers', () => {
    const result = validator.isDrivingLicence('AA1234567');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is more letters', () => {
    const result = validator.isDrivingLicence('AAA123456');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isDrivingLicence(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isDrivingLicence(true);
    expect(result).toBe(false);
  });
});

describe('isIdCardNumber', () => {
  it('Should be true if parameter is valid id card number started with two large letters', () => {
    const result = validator.isIdCardNumber('MA123456');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid id card number started with number', () => {
    const result = validator.isIdCardNumber('123456MA');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is started with small letters', () => {
    const result = validator.isIdCardNumber('ma123456');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is with small letters in the end', () => {
    const result = validator.isIdCardNumber('123456ma');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isIdCardNumber(true);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isIdCardNumber(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is have special character', () => {
    const result = validator.isIdCardNumber('MA12#345');
    expect(result).toBe(false);
  });
});

describe('isAdressCardNumber', () => {
  it('Should be true if parameter is card number started with two large letters', () => {
    const result = validator.isAddressCardNumber('MA123456');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is card number started with number', () => {
    const result = validator.isAddressCardNumber('123456MA');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is started with small letters', () => {
    const result = validator.isAddressCardNumber('ma123456');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is with small letters in the end', () => {
    const result = validator.isAddressCardNumber('123456ma');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isAddressCardNumber(true);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isAddressCardNumber(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is have special character', () => {
    const result = validator.isAddressCardNumber('MA12#345');
    expect(result).toBe(false);
  });
});

describe('isPhoneNumber', () => {
  it('Should be true if parameter is valid phone number', () => {
    const result = validator.isPhoneNumber('+1234567890');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid foreign phone number', () => {
    const result = validator.isPhoneNumber('+12345678902020');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid home phone number', () => {
    const result = validator.isPhoneNumber('+12345678');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is string', () => {
    const result = validator.isPhoneNumber('test');
    expect(result).toBe(false);
  });
});

describe('isBankAccount', () => {
  it('Should be true if parameter is valid bank account', () => {
    const result = validator.isBankAccount('12345678-12345678-12345678');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid bank account twight eight number', () => {
    const result = validator.isBankAccount('12345678-12345678');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is invalid bank account', () => {
    const result = validator.isBankAccount('123456789-12345678');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is string', () => {
    const result = validator.isBankAccount('abcdefgh-abcdefgh');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isBankAccount(true);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isBankAccount(undefined);
    expect(result).toBe(false);
  });
});

describe('isTaxNumber', () => {
  it('Should be true if parameter is valid tax number', () => {
    const result = validator.isTaxNumber('12345678-1-12');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid tax number', () => {
    const result = validator.isTaxNumber('HU12345678');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is invalid letters', () => {
    const result = validator.isTaxNumber('AM12345678');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is valid and small letters', () => {
    const result = validator.isTaxNumber('hu12345678');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is only string', () => {
    const result = validator.isTaxNumber('HU');
    expect(result).toBe(false);
  });
});

describe('isSocialInsuranceNumber', () => {
  it('Should be true if parameter is valid social insurance number with hyphen', () => {
    const result = validator.isSocialInsuranceNumber('123-123-123');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid social insurance number with white space', () => {
    const result = validator.isSocialInsuranceNumber('123 123 123');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is valid social insurance number with per sign', () => {
    const result = validator.isSocialInsuranceNumber('123/123/123');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is valid social insurance number with hyphen and white space', () => {
    const result = validator.isSocialInsuranceNumber('123 -123 -123');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is string', () => {
    const result = validator.isSocialInsuranceNumber('abc-abc-abc');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is fewer character', () => {
    const result = validator.isSocialInsuranceNumber('123-123');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isSocialInsuranceNumber(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isSocialInsuranceNumber(true);
    expect(result).toBe(false);
  });
});

describe('isCreditCardVisa', () => {
  it('Should be true if parameter is valid Visa card', () => {
    const result = validator.isCreditCardVisa('4123456789012123');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid Visa card', () => {
    const result = validator.isCreditCardVisa('4123456789012');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is first number not 4', () => {
    const result = validator.isCreditCardVisa('1123456789012');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is string', () => {
    const result = validator.isCreditCardVisa('test');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is 17 number', () => {
    const result = validator.isCreditCardVisa('41234567891234');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefiend', () => {
    const result = validator.isCreditCardVisa(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is speciel character', () => {
    const result = validator.isCreditCardVisa('4123#567890123');
    expect(result).toBe(false);
  });
});

describe('isCreditCardMasterCard', () => {
  it('Should be true if parameter is valid master card', () => {
    const result = validator.isCreditCardMastercard('5312345678901234');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is number not started 5', () => {
    const result = validator.isCreditCardMastercard('4312345678901234');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is second number not between one and five', () => {
    const result = validator.isCreditCardMastercard('5612345678901234');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is less number', () => {
    const result = validator.isCreditCardMastercard('561234567890123');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is more number', () => {
    const result = validator.isCreditCardMastercard('56123456789012345');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is have hyphen', () => {
    const result = validator.isCreditCardMastercard('5612-3456-7890-1234');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isCreditCardMastercard(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isCreditCardMastercard(true);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is string', () => {
    const result = validator.isCreditCardMastercard('abcdeabcdeabcdeabcde');
    expect(result).toBe(false);
  });
});

describe('isCreditCardAmericanExpress', () => {
  it('Should be true if parameter is valid american express card', () => {
    const result = validator.isCreditCardAmericanExpress('341234567890123');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is less number', () => {
    const result = validator.isCreditCardAmericanExpress('34123456789012');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is more number', () => {
    const result = validator.isCreditCardAmericanExpress('3412345678901234');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is has a letter', () => {
    const result = validator.isCreditCardAmericanExpress('34123456789012a');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isCreditCardAmericanExpress(true);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isCreditCardAmericanExpress(undefined);
    expect(result).toBe(false);
  });
});

describe('isCreditCardDiscover', () => {
  it('Should be true if parameter is valid discover card', () => {
    const result = validator.isCreditCardDiscover('6523123456789012');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is other valid discover card', () => {
    const result = validator.isCreditCardDiscover('6011123456789101');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is more numbers', () => {
    const result = validator.isCreditCardDiscover('60111234567891013');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is special character', () => {
    const result = validator.isCreditCardDiscover('60-11234567#1013');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is string', () => {
    const result = validator.isCreditCardDiscover('test');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isCreditCardDiscover(true);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isCreditCardDiscover(undefined);
    expect(result).toBe(false);
  });
});

describe('isArray', () => {
  it('Should be true if parameter is array', () => {
    const result = validator.isArray(['test1', 'test2', 'test3', 2]);
    expect(result).toBe(true);
  });

  it('Should be true if parameter is array', () => {
    const result = validator.isArray([]);
    expect(result).toBe(true);
  });

  it('Should be false if parameter is number', () => {
    const result = validator.isArray(3);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is string', () => {
    const result = validator.isArray('test');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isArray(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is null', () => {
    const result = validator.isArray(null);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isArray(true);
    expect(result).toBe(false);
  });
});

describe('isEmpty', () => {
  it('Should be true if parameter is empty string', () => {
    const result = validator.isEmpty('');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is empty array', () => {
    const result = validator.isEmpty([]);
    expect(result).toBe(true);
  });

  it('Should be false if parameter is have anything', () => {
    const result = validator.isEmpty('test');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isEmpty(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is null', () => {
    const result = validator.isEmpty(null);
    expect(result).toBe(false);
  });
});

describe('isNotEmpty', () => {
  it('Should be true if parameter is have anything', () => {
    const result = validator.isNotEmpty('aa');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is empty', () => {
    const result = validator.isNotEmpty('');
    expect(result).toBe(false);
  });
});

describe('isPersonTaxNumber', () => {
  it('Should be true if parameter is valid person tax number', () => {
    const result = validator.isPersonTaxNumber('1234567890');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is has letter', () => {
    const result = validator.isPersonTaxNumber('A234567890');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is less number', () => {
    const result = validator.isPersonTaxNumber('123456789');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is more number', () => {
    const result = validator.isPersonTaxNumber('12345678901');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isPersonTaxNumber(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isPersonTaxNumber(true);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is null', () => {
    const result = validator.isPersonTaxNumber(null);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is empty', () => {
    const result = validator.isPersonTaxNumber('');
    expect(result).toBe(false);
  });
});

describe('isColorCode', () => {
  it('Should be true if parameter is valid 6 digit hex color', () => {
    const result = validator.isColorCode('#123456');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid 3 digit hex color', () => {
    const result = validator.isColorCode('#123');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid hex color with uppercase', () => {
    const result = validator.isColorCode('#ABCDEF');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid hex color with mixed case', () => {
    const result = validator.isColorCode('#AbCdEf');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is missing #', () => {
    const result = validator.isColorCode('123456');
    expect(result).toBe(false);
  });

  it('Should be false if parameter has invalid characters', () => {
    const result = validator.isColorCode('#GHIJKL');
    expect(result).toBe(false);
  });

  it('Should be false if parameter has wrong length', () => {
    const result = validator.isColorCode('#12');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is null', () => {
    const result = validator.isColorCode(null);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isColorCode(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is empty string', () => {
    const result = validator.isColorCode('');
    expect(result).toBe(false);
  });
});

describe('isIbanCode', () => {
  it('Should be true if parameter is valid IBAN format (2 letters + 2 digits)', () => {
    const result = validator.isIbanCode('GB29');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid IBAN format (4 letters)', () => {
    const result = validator.isIbanCode('NWBK');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is valid IBAN format (4 digits)', () => {
    const result = validator.isIbanCode('6016');
    expect(result).toBe(true);
  });

  it('Should be false if parameter has wrong format', () => {
    const result = validator.isIbanCode('GB2A');
    expect(result).toBe(false);
  });

  it('Should be false if parameter has wrong length', () => {
    const result = validator.isIbanCode('GB');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isIbanCode(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isIbanCode(true);
    expect(result).toBe(false);
  });
});

describe('isSwiftCode', () => {
  it('Should be true if parameter is 8 digit swift code', () => {
    const result = validator.isSwiftCode('12345678');
    expect(result).toBe(true);
  });

  it('Should be true if parameter is 11 digit swift code', () => {
    const result = validator.isSwiftCode('12345678901');
    expect(result).toBe(true);
  });

  it('Should be false if parameter has 9 digits', () => {
    const result = validator.isSwiftCode('123456789');
    expect(result).toBe(false);
  });

  it('Should be false if parameter has 10 digits', () => {
    const result = validator.isSwiftCode('1234567890');
    expect(result).toBe(false);
  });

  it('Should be false if parameter has letters', () => {
    const result = validator.isSwiftCode('1234567A');
    expect(result).toBe(false);
  });

  it('Should be false if parameter is undefined', () => {
    const result = validator.isSwiftCode(undefined);
    expect(result).toBe(false);
  });

  it('Should be false if parameter is boolean', () => {
    const result = validator.isSwiftCode(true);
    expect(result).toBe(false);
  });
});

describe('isCreditCard', () => {
  it('Should be true for valid Visa card', () => {
    const result = validator.isCreditCard('4123456789012123');
    expect(result).toBe(true);
  });

  it('Should be true for valid Mastercard', () => {
    const result = validator.isCreditCard('5312345678901234');
    expect(result).toBe(true);
  });

  it('Should be true for valid American Express card', () => {
    const result = validator.isCreditCard('341234567890123');
    expect(result).toBe(true);
  });

  it('Should be true for valid Discover card', () => {
    const result = validator.isCreditCard('6011123456789101');
    expect(result).toBe(true);
  });

  it('Should be false for invalid card number', () => {
    const result = validator.isCreditCard('1234567890123456');
    expect(result).toBe(false);
  });

  it('Should be false for string', () => {
    const result = validator.isCreditCard('invalid');
    expect(result).toBe(false);
  });

  it('Should be false for undefined', () => {
    const result = validator.isCreditCard(undefined);
    expect(result).toBe(false);
  });
});

describe('isNullable', () => {
  it('Should be true for any value', () => {
    const result = validator.isNullable('test');
    expect(result).toBe(true);
  });

  it('Should be true for null', () => {
    const result = validator.isNullable(null);
    expect(result).toBe(true);
  });

  it('Should be true for undefined', () => {
    const result = validator.isNullable(undefined);
    expect(result).toBe(true);
  });

  it('Should be true for number', () => {
    const result = validator.isNullable(123);
    expect(result).toBe(true);
  });

  it('Should be true for boolean', () => {
    const result = validator.isNullable(false);
    expect(result).toBe(true);
  });
});

describe('min', () => {
  it('Should be true if number is greater than minimum', () => {
    const result = validator.min(10, 5);
    expect(result).toBe(true);
  });

  it('Should be true if number equals minimum', () => {
    const result = validator.min(5, 5);
    expect(result).toBe(true);
  });

  it('Should be false if number is less than minimum', () => {
    const result = validator.min(3, 5);
    expect(result).toBe(false);
  });

  it('Should be true if array length is greater than minimum', () => {
    const result = validator.min([1, 2, 3, 4, 5], 3);
    expect(result).toBe(true);
  });

  it('Should be true if array length equals minimum', () => {
    const result = validator.min([1, 2, 3], 3);
    expect(result).toBe(true);
  });

  it('Should be false if array length is less than minimum', () => {
    const result = validator.min([1, 2], 3);
    expect(result).toBe(false);
  });

  it('Should be true if string length is greater than minimum', () => {
    const result = validator.min('hello', 3);
    expect(result).toBe(true);
  });

  it('Should be true if string length equals minimum', () => {
    const result = validator.min('abc', 3);
    expect(result).toBe(true);
  });

  it('Should be false if string length is less than minimum', () => {
    const result = validator.min('ab', 3);
    expect(result).toBe(false);
  });

  it('Should be false for other data types', () => {
    const result = validator.min({}, 1);
    expect(result).toBe(false);
  });
});

describe('max', () => {
  it('Should be true if number is less than maximum', () => {
    const result = validator.max(3, 5);
    expect(result).toBe(true);
  });

  it('Should be true if number equals maximum', () => {
    const result = validator.max(5, 5);
    expect(result).toBe(true);
  });

  it('Should be false if number is greater than maximum', () => {
    const result = validator.max(7, 5);
    expect(result).toBe(false);
  });

  it('Should be true if array length is less than maximum', () => {
    const result = validator.max([1, 2], 3);
    expect(result).toBe(true);
  });

  it('Should be true if array length equals maximum', () => {
    const result = validator.max([1, 2, 3], 3);
    expect(result).toBe(true);
  });

  it('Should be false if array length is greater than maximum', () => {
    const result = validator.max([1, 2, 3, 4], 3);
    expect(result).toBe(false);
  });

  it('Should be true if string length is less than maximum', () => {
    const result = validator.max('ab', 3);
    expect(result).toBe(true);
  });

  it('Should be true if string length equals maximum', () => {
    const result = validator.max('abc', 3);
    expect(result).toBe(true);
  });

  it('Should be false if string length is greater than maximum', () => {
    const result = validator.max('abcd', 3);
    expect(result).toBe(false);
  });

  it('Should be false for other data types', () => {
    const result = validator.max({}, 1);
    expect(result).toBe(false);
  });
});

describe('validate', () => {
  it('Should return true for valid string validation', () => {
    const result = validator.validate('test', 'string');
    expect(result).toBe(true);
  });

  it('Should return true for valid number validation', () => {
    const result = validator.validate(123, 'number');
    expect(result).toBe(true);
  });

  it('Should return true for valid boolean validation', () => {
    const result = validator.validate(true, 'boolean');
    expect(result).toBe(true);
  });

  it('Should return true for valid integer validation', () => {
    const result = validator.validate(123, 'integer');
    expect(result).toBe(true);
  });

  it('Should return true for valid required validation', () => {
    const result = validator.validate('test', 'required');
    expect(result).toBe(true);
  });

  it('Should return true for valid array of rules', () => {
    const result = validator.validate('test', ['string', 'required']);
    expect(result).toBe(true);
  });

  it('Should return false for invalid validation', () => {
    const result = validator.validate('test', 'number');
    expect(result).toBe(false);
  });

  it('Should return true for nullable with null value', () => {
    const result = validator.validate(null, 'nullable');
    expect(result).toBe(true);
  });

  it('Should return true for nullable with undefined value', () => {
    const result = validator.validate(undefined, ['nullable', 'string']);
    expect(result).toBe(true);
  });

  it('Should return true for nullable with empty string', () => {
    const result = validator.validate('', ['nullable', 'string']);
    expect(result).toBe(true);
  });

  it('Should return true for nullable with empty array', () => {
    const result = validator.validate([], ['nullable', 'array']);
    expect(result).toBe(true);
  });

  it('Should validate name correctly', () => {
    const result = validator.validate('John Doe', 'name');
    expect(result).toBe(true);
  });

  it('Should validate email correctly', () => {
    const result = validator.validate('test@example.com', 'email');
    expect(result).toBe(true);
  });

  it('Should validate domain correctly', () => {
    const result = validator.validate('example.com', 'domain');
    expect(result).toBe(true);
  });

  it('Should validate url correctly', () => {
    const result = validator.validate('https://www.example.com', 'url');
    expect(result).toBe(true);
  });

  it('Should validate iso_date correctly', () => {
    const result = validator.validate('2023-01-01', 'iso_date');
    expect(result).toBe(true);
  });

  it('Should validate driving_licence correctly', () => {
    const result = validator.validate('AA123456', 'driving_licence');
    expect(result).toBe(true);
  });

  it('Should validate id_card_number correctly', () => {
    const result = validator.validate('MA123456', 'id_card_number');
    expect(result).toBe(true);
  });

  it('Should validate address_card_number correctly', () => {
    const result = validator.validate('AA123456', 'address_card_number');
    expect(result).toBe(true);
  });

  it('Should validate phonenumber correctly', () => {
    const result = validator.validate('+1234567890', 'phonenumber');
    expect(result).toBe(true);
  });

  it('Should validate bankaccount correctly', () => {
    const result = validator.validate('12345678-12345678', 'bankaccount');
    expect(result).toBe(true);
  });

  it('Should validate taxnumber correctly', () => {
    const result = validator.validate('12345678-1-12', 'taxnumber');
    expect(result).toBe(true);
  });

  it('Should validate social_insurance_number correctly', () => {
    const result = validator.validate('123-123-123', 'social_insurance_number');
    expect(result).toBe(true);
  });

  it('Should validate not_zero correctly', () => {
    const result = validator.validate(5, 'not_zero');
    expect(result).toBe(true);
  });

  it('Should validate lang correctly', () => {
    const result = validator.validate('en', 'lang');
    expect(result).toBe(true);
  });

  it('Should validate register_number correctly', () => {
    const result = validator.validate('12-12-123456', 'register_number');
    expect(result).toBe(true);
  });

  it('Should validate array correctly', () => {
    const result = validator.validate(['test'], 'array');
    expect(result).toBe(true);
  });

  it('Should validate not_empty correctly', () => {
    const result = validator.validate('test', 'not_empty');
    expect(result).toBe(true);
  });

  it('Should validate empty correctly', () => {
    const result = validator.validate('', 'empty');
    expect(result).toBe(true);
  });

  it('Should validate person_taxnumber correctly', () => {
    const result = validator.validate('1234567890', 'person_taxnumber');
    expect(result).toBe(true);
  });

  it('Should validate color_code correctly', () => {
    const result = validator.validate('#123456', 'color_code');
    expect(result).toBe(true);
  });

  it('Should validate iban_code correctly', () => {
    const result = validator.validate('GB29', 'iban_code');
    expect(result).toBe(true);
  });

  it('Should validate swift_code correctly', () => {
    const result = validator.validate('12345678', 'swift_code');
    expect(result).toBe(true);
  });

  it('Should validate min rule correctly', () => {
    const result = validator.validate('hello', 'min:3');
    expect(result).toBe(true);
  });

  it('Should validate max rule correctly', () => {
    const result = validator.validate('hi', 'max:5');
    expect(result).toBe(true);
  });

  it('Should return false for unknown rule', () => {
    const result = validator.validate('test', 'unknown_rule');
    expect(result).toBe(false);
  });

  it('Should handle nullable rule without adding to results', () => {
    const result = validator.validate('test', ['nullable', 'string']);
    expect(result).toBe(true);
  });
});

describe('validateObject', () => {
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 25,
    isActive: true
  };

  const validRules = {
    name: ['string', 'required'],
    email: ['email', 'required'],
    age: ['integer', 'required'],
    isActive: ['boolean', 'required']
  };

  it('Should return [true, []] for valid data', () => {
    const [result, invalids] = validator.validateObject(validData, validRules, false);
    expect(result).toBe(true);
    expect(invalids).toEqual([]);
  });

  it('Should return [false, [invalidFields]] for invalid data', () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      age: 'not-a-number',
      isActive: 'not-a-boolean'
    };

    const [result, invalids] = validator.validateObject(invalidData, validRules, false);
    expect(result).toBe(false);
    expect(invalids).toContain('name');
    expect(invalids).toContain('email');
    expect(invalids).toContain('age');
    expect(invalids).toContain('isActive');
  });

  it('Should throw ValidationError when isThrowError is true (default)', () => {
    const invalidData = {
      name: '',
      email: 'invalid-email'
    };

    const rules = {
      name: ['string', 'required'],
      email: ['email', 'required']
    };

    const settings: ValidationErrorSettingsInterface = {
      message: 'Validation failed',
      invalids: []
    };

    expect(() => {
      validator.validateObject(invalidData, rules, true, settings);
    }).toThrow(ValidationError);
  });

  it('Should throw ValidationError with correct invalids when validation fails', () => {
    const invalidData = {
      name: '',
      email: 'invalid'
    };

    const rules = {
      name: ['required'],
      email: ['email']
    };

    const settings: ValidationErrorSettingsInterface = {
      message: 'Test error',
      invalids: []
    };

    try {
      validator.validateObject(invalidData, rules, true, settings);
      fail('Should have thrown ValidationError');
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.invalids).toContain('name');
      expect(error.invalids).toContain('email');
    }
  });

  it('Should not throw error when isThrowError is false', () => {
    const invalidData = {
      name: '',
      email: 'invalid'
    };

    const rules = {
      name: ['required'],
      email: ['email']
    };

    const settings: ValidationErrorSettingsInterface = {
      message: 'Test error',
      invalids: []
    };

    expect(() => {
      const [result, invalids] = validator.validateObject(invalidData, rules, false, settings);
      expect(result).toBe(false);
      expect(invalids.length).toBeGreaterThan(0);
    }).not.toThrow();
  });

  it('Should handle empty rules object', () => {
    const [result, invalids] = validator.validateObject(validData, {}, false);
    expect(result).toBe(true);
    expect(invalids).toEqual([]);
  });

  it('Should handle nullable fields correctly', () => {
    const dataWithNulls = {
      name: 'John',
      optional: null
    };

    const rulesWithNullable = {
      name: ['string', 'required'],
      optional: ['string', 'nullable']
    };

    const [result, invalids] = validator.validateObject(dataWithNulls, rulesWithNullable, false);
    expect(result).toBe(true);
    expect(invalids).toEqual([]);
  });
});

// Test edge cases for better coverage
describe('ValidatorService Edge Cases', () => {
  it('isBoolean should handle 0 and 1 as boolean', () => {
    expect(validator.isBoolean(0)).toBe(true);
    expect(validator.isBoolean(1)).toBe(true);
  });

  it('isBoolean should handle null as boolean', () => {
    expect(validator.isBoolean(null)).toBe(true);
  });

  it('isNumber should handle NaN correctly', () => {
    expect(validator.isNumber(NaN)).toBe(false);
  });

  it('isRequired should handle empty objects correctly', () => {
    expect(validator.isRequired({})).toBe(false);
  });

  it('isRequired should handle empty arrays correctly', () => {
    expect(validator.isRequired([])).toBe(false);
  });

  it('isEmpty should handle objects without length property', () => {
    expect(validator.isEmpty(undefined)).toBe(false);
    expect(validator.isEmpty(null)).toBe(false);
  });

  it('isNotEmpty should handle data with length > 0', () => {
    expect(validator.isNotEmpty('a')).toBe(true);
    expect(validator.isNotEmpty([1])).toBe(true);
  });

  it('Should handle phoneNumber with minimum 10 digits requirement', () => {
    expect(validator.isPhoneNumber('+123456789')).toBe(false); // 9 digits after +
    expect(validator.isPhoneNumber('+1234567890')).toBe(true); // 10 digits after +
  });

  it('Should handle integer validation with float numbers', () => {
    expect(validator.isInteger(3.14)).toBe(false);
    expect(validator.isInteger(3.0)).toBe(true);
  });

  it('Should handle validation with multiple rules and one failure', () => {
    const result = validator.validate('', ['string', 'required']);
    expect(result).toBe(false);
  });

  it('Should handle validation with rule that has colon but no value', () => {
    const result = validator.validate('test', 'min:');
    expect(result).toBe(true); // NaN comparison should work
  });
});
});
