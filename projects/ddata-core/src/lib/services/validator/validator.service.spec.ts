import { ValidatorService } from './validator.service';

const validator = new ValidatorService();

xdescribe('isString', () => {
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

xdescribe('isNumber', () => {
  it('Should be true if parameter is number', () => {
    const result = validator.isNumber(4);
    expect(result).toBe(true);
  });

  it('Should be false if parameter is number', () => {
    const result = validator.isNumber('test');
    expect(result).toBe(false);
  });
});

xdescribe('isBoolean', () => {
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

xdescribe('isRequired', () => {
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

xdescribe('isInteger', () => {
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

xdescribe('isNotZero', () => {
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

xdescribe('isregisterNumber', () => {
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

xdescribe('isLang', () => {
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

xdescribe('isName', () => {
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

xdescribe('isEmail', () => {
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

xdescribe('isDomain', () => {
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

xdescribe('isUrl', () => {
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

// xdescribe('isSettlementName', () => {
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

xdescribe('isIsoDate', () => {
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

xdescribe('isDrivingLicencce', () => {
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

xdescribe('isIdCardNumber', () => {
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

xdescribe('isAdressCardNumber', () => {
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

xdescribe('isPhoneNumber', () => {
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

xdescribe('isBankAccount', () => {
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

xdescribe('isTaxNumber', () => {
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

xdescribe('isSocialInsuranceNumber', () => {
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

xdescribe('isCreditCardVisa', () => {
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

xdescribe('isCreditCardMasterCard', () => {
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

xdescribe('isCreditCardAmericanExpress', () => {
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

xdescribe('isCreditCardDiscover', () => {
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

xdescribe('isArray', () => {
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

xdescribe('isEmpty', () => {
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

xdescribe('isNotEmpty', () => {
  it('Should be true if parameter is have anything', () => {
    const result = validator.isNotEmpty('aa');
    expect(result).toBe(true);
  });

  it('Should be false if parameter is empty', () => {
    const result = validator.isNotEmpty('');
    expect(result).toBe(false);
  });
});

xdescribe('isPersonTaxNumber', () => {
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
