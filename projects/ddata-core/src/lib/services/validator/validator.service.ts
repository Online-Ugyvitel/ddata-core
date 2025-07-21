/* eslint-disable @typescript-eslint/no-unused-vars */
// tslint:disable: max-line-length
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { ValidationErrorSettingsInterface } from '../../models/error/validation-error-settings.model';
import { ValidationError } from '../../models/error/validation-error.model';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  private readonly addressCardNumberRegExp: RegExp = new RegExp(/^([A-Z]{2}\d{6})$/);
  private readonly bankaccountRegExp: RegExp = new RegExp(/^(\d{8}\-)(\d{8})(-\d{8})?$/);
  private readonly colorCodeRegExp: RegExp = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
  private readonly creditCardAmericanExpressRegExp = new RegExp(/^(?:3[47][0-9]{13})$/);
  private readonly creditCardDiscoverRegExp = new RegExp(/^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/);
  private readonly creditCardMastercardRegExp = new RegExp(/^(?:5[1-5][0-9]{14})$/);
  private readonly creditCardVisaRegExp = new RegExp(/^(?:4[0-9]{12}(?:[0-9]{3})?)$/);
  private readonly domainRegExp: RegExp = new RegExp(
    /^(?:(?:(?:[a-zA-Z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9-\.]){1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/
  );

  private readonly drivingLicenceRegExp: RegExp = new RegExp(/^([A-Z]{2}\d{6})$/);
  private readonly emailRegExp: RegExp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  private readonly ibanCodeRegExp: RegExp = new RegExp(/^([A-Z]{2}\d{2})|([A-Z]{4})|(\d{4})$/);
  private readonly idCardNumberRegExp: RegExp = new RegExp(/^(([A-Z]{2}\d{6})|(\d{6}[A-Z]{2}))$/);
  private readonly isoDateRegExp: RegExp = new RegExp(
    /^(\d{4})([\.\-\/])(0[0-9]|1[0-2])([\.\-\/])([0-2][0-9]|3[0-1])$/
  );

  private readonly langRegExp = new RegExp(/^[A-Za-z]{2}$/);
  private readonly nameRegExp: RegExp = new RegExp(
    /^([a-zA-Z]+[\.]? )*([A-ZÁÉÍÓÖŐÚÜŰ][a-záéíúüűóöő]*)([ -]([A-ZÁÉÍÓÖŐÚÜŰ][a-záéíúüűóöő-]*))*([MD])?$/
  );

  private readonly personTaxNumberRegExp: RegExp = new RegExp(/^\d{10}$/);
  private readonly phonenumberRegExp: RegExp = new RegExp(/^[+]\d{10,}$/);
  private readonly registerNumberRegExp: RegExp = new RegExp(/^(\d{2}\-)(\d{2})(-\d{6})$/);
  private readonly socialInsuranceNumberRegExp: RegExp = new RegExp(/^(\d{3}[ \-]?){2}(\d{3})$/);
  private readonly swiftCodeRegExp: RegExp = new RegExp(/^((\d{8})|(\d{11}))$/);
  private readonly taxnumberRegExp: RegExp = new RegExp(
    /^(\d{8})\-\d\-(\d\d)$|^(AT|BE|BG|CY|CZ|DE|DK|EE|EL|ES|FI|FR|GB|HR|HU|IE|IT|LT|LU|LV|MT|NL|PL|PT|RO|SE|SI|SK)\d{8}$/
  );

  private readonly urlRegExp: RegExp = new RegExp(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/
  );

  /**
   * Validate JSON objects based on custom rules.
   *
   * @param data JSON object of datas
   * @param rules JSON object of rules. Each item of `rules` must be an array of validation keywords, rules.
   * @param throwError boolean, default true - if validation fails then ValidationError happen.
   *
   * ```
   * rules = {
   *   id: ['integer', 'required'],
   *   date_of_birth: ['iso_date', 'required'],
   *   passport: ['string', 'nullable'],
   *   identity_card_number: ['id_card_number', 'required']
   * }
   * ```
   */
  validateObject(
    data: any,
    rules: any,
    isThrowError = true,
    settings?: ValidationErrorSettingsInterface
  ): [boolean, Array<string>] {
    const results: Array<boolean> = [];
    const invalids: Array<string> = [];

    Object.keys(rules).forEach((key: string) => {
      const fieldValidationResult = this.validate(data[key], rules[key]);

      results.push(fieldValidationResult);

      if (!fieldValidationResult) {
        invalids.push(key);
      }
    });
    const result = results.every(this.isTrue);

    if (!result && isThrowError) {
      settings.invalids = invalids;
      throw new ValidationError(settings);
    }

    return [result, invalids];
  }

  validate(data: any, rules: string | Array<string>): boolean {
    const ruleList: Array<string> = typeof rules === 'string' ? [rules] : rules;
    const results: Array<boolean> = [];

    if (ruleList.includes('nullable') && data == null) {
      return true;
    }

    // if nullable rule enabled
    if (
      (ruleList.includes('nullable') && data === undefined) ||
      (ruleList.includes('nullable') && data.length === 0)
    ) {
      return true;
    }

    // TODO megcsinálni, hogy kitalálja a függvény a szabályt a típus alapján. Pl. BankAccountNumber - bankaacount

    // eslint-disable-next-line complexity
    ruleList.forEach((rule: string) => {
      const [ruleType, ruleValue] = rule.split(':');

      switch (ruleType) {
        case 'string':
          results.push(this.isString(data));
          break;
        case 'number':
          results.push(this.isNumber(data));
          break;
        case 'boolean':
          results.push(this.isBoolean(data));
          break;
        case 'integer':
          results.push(this.isInteger(data));
          break;
        case 'required':
          results.push(this.isRequired(data));
          break;
        case 'name':
          results.push(this.isName(data));
          break;
        case 'email':
          results.push(this.isEmail(data));
          break;
        case 'domain':
          results.push(this.isDomain(data));
          break;
        case 'url':
          results.push(this.isUrl(data));
          break;
        case 'iso_date':
          results.push(this.isIsoDate(data));
          break;
        case 'driving_licence':
          results.push(this.isDrivingLicence(data));
          break;
        case 'id_card_number':
          results.push(this.isIdCardNumber(data));
          break;
        case 'address_card_number':
          results.push(this.isAddressCardNumber(data));
          break;
        case 'phonenumber':
          results.push(this.isPhoneNumber(data));
          break;
        case 'bankaccount':
          results.push(this.isBankAccount(data));
          break;
        case 'taxnumber':
          results.push(this.isTaxNumber(data));
          break;
        case 'social_insurance_number':
          results.push(this.isSocialInsuranceNumber(data));
          break;
        case 'not_zero':
          results.push(this.isNotZero(data));
          break;
        case 'lang':
          results.push(this.isLang(data));
          break;
        case 'register_number':
          results.push(this.isregisterNumber(data));
          break;
        case 'array':
          results.push(this.isArray(data));
          break;
        case 'not_empty':
          results.push(this.isNotEmpty(data));
          break;
        case 'empty':
          results.push(this.isEmpty(data));
          break;
        case 'person_taxnumber':
          results.push(this.isPersonTaxNumber(data));
          break;
        case 'color_code':
          results.push(this.isColorCode(data));
          break;
        case 'nullable':
          // results.push(true);
          break;
        case 'iban_code':
          results.push(this.isIbanCode(data));
          break;
        case 'swift_code':
          results.push(this.isSwiftCode(data));
          break;
        case 'min':
          results.push(this.min(data, Number(ruleValue)));
          break;
        case 'max':
          results.push(this.max(data, Number(ruleValue)));
          break;

        default:
          results.push(false);
      }
    });

    return results.every(this.isTrue);
  }

  private isTrue(value: boolean): boolean {
    return value;
  }

  min(data: any, minimum: number): boolean {
    // number
    if (typeof data === 'number') {
      return data >= minimum;
    }

    // array length
    if (data instanceof Array) {
      return data.length >= minimum;
    }

    // string length
    if (typeof data === 'string') {
      return data.length >= minimum;
    }

    return false;
  }

  max(data: any, maximum: number): boolean {
    // number
    if (typeof data === 'number') {
      return data <= maximum;
    }

    // array length
    if (data instanceof Array) {
      return data.length <= maximum;
    }

    // string length
    if (typeof data === 'string') {
      return data.length <= maximum;
    }

    return false;
  }

  isRequired(data: any): boolean {
    if (data instanceof Array && data.length === 0) {
      return false;
    }

    if (data instanceof Object && Object.keys(data).length === 0) {
      return false;
    }

    if (data !== undefined && data !== null && data !== '') {
      return true;
    }

    return false;
  }

  isNullable(data: any): boolean {
    return true;
  }

  isString(data: any): boolean {
    if (typeof data === 'string') {
      return true;
    }

    return false;
  }

  isBoolean(data: any): boolean {
    return data === true || data === false || data === null || data === 1 || data === 0;
  }

  isNumber(data: any): boolean {
    return !Number.isNaN(data);
  }

  isInteger(data: any): boolean {
    if (typeof data === 'number' && Number.isInteger(data)) {
      return true;
    }

    return false;
  }

  isNotZero(data: any): boolean {
    return data !== 0;
  }

  isregisterNumber(data: any): boolean {
    return this.registerNumberRegExp.test(data);
  }

  isLang(data: any): boolean {
    return this.langRegExp.test(data);
  }

  isName(data: any): boolean {
    return this.nameRegExp.test(data);
  }

  isEmail(data: any): boolean {
    return this.emailRegExp.test(data);
  }

  isDomain(data: any): boolean {
    return this.domainRegExp.test(data);
  }

  isUrl(data: any): boolean {
    return this.urlRegExp.test(data);
  }

  isIsoDate(data: any): boolean {
    return this.isoDateRegExp.test(data);
  }

  isDrivingLicence(data: any): boolean {
    return this.drivingLicenceRegExp.test(data);
  }

  isIdCardNumber(data: any): boolean {
    return this.idCardNumberRegExp.test(data);
  }

  isAddressCardNumber(data: any): boolean {
    return this.addressCardNumberRegExp.test(data);
  }

  isPhoneNumber(data: any): boolean {
    return this.phonenumberRegExp.test(data);
  }

  isBankAccount(data: any): boolean {
    return this.bankaccountRegExp.test(data);
  }

  isTaxNumber(data: any): boolean {
    return this.taxnumberRegExp.test(data);
  }

  isSocialInsuranceNumber(data: any): boolean {
    return this.socialInsuranceNumberRegExp.test(data);
  }

  isCreditCard(data: any): boolean {
    const results: Array<boolean> = [
      this.isCreditCardVisa(data),
      this.isCreditCardMastercard(data),
      this.isCreditCardAmericanExpress(data),
      this.isCreditCardDiscover(data)
    ];

    return results.includes(true);
  }

  isCreditCardVisa(data: any): boolean {
    return this.creditCardVisaRegExp.test(data);
  }

  isCreditCardMastercard(data: any): boolean {
    return this.creditCardMastercardRegExp.test(data);
  }

  isCreditCardAmericanExpress(data: any): boolean {
    return this.creditCardAmericanExpressRegExp.test(data);
  }

  isCreditCardDiscover(data: any): boolean {
    return this.creditCardDiscoverRegExp.test(data);
  }

  isArray(data: any): boolean {
    return data instanceof Array;
  }

  isEmpty(data: any): boolean {
    if (data !== undefined && data !== null) {
      return data.length === 0;
    }

    return false;
  }

  isNotEmpty(data: any): boolean {
    return data.length > 0;
  }

  isPersonTaxNumber(data: any): boolean {
    if (!data) {
      return false;
    }

    return this.personTaxNumberRegExp.test(data);
  }

  isColorCode(data: any): boolean {
    if (!data) {
      return false;
    }

    return this.colorCodeRegExp.test(data);
  }

  isIbanCode(data: any): boolean {
    return this.ibanCodeRegExp.test(data);
  }

  isSwiftCode(data: any): boolean {
    return this.swiftCodeRegExp.test(data);
  }
}
