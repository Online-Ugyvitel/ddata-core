import { ValidationErrorSettingsInterface } from '../../models/error/validation-error-settings.model';

export interface ValidatorServiceInterface {
  validateObject(
    data: any,
    rules: any,
    isThrowError: boolean,
    settings?: ValidationErrorSettingsInterface
  ): [boolean, Array<string>];

  validate(data: any, rules: string | Array<string>): boolean;

  // rule functions
  min(data: any, minimum: number): boolean;

  max(data: any, maximum: number): boolean;

  isRequired(data: any): boolean;

  isNullable(data: any): boolean;

  isString(data: any): boolean;

  isBoolean(data: any): boolean;

  isNumber(data: any): boolean;

  isInteger(data: any): boolean;

  isNotZero(data: any): boolean;

  isregisterNumber(data: any): boolean;

  isLang(data: any): boolean;

  isName(data: any): boolean;

  isEmail(data: any): boolean;

  isDomain(data: any): boolean;

  isUrl(data: any): boolean;

  isIsoDate(data: any): boolean;

  isDrivingLicence(data: any): boolean;

  isIdCardNumber(data: any): boolean;

  isAddressCardNumber(data: any): boolean;

  isPhoneNumber(data: any): boolean;

  isBankAccount(data: any): boolean;

  isTaxNumber(data: any): boolean;

  isSocialInsuranceNumber(data: any): boolean;

  isCreditCard(data: any): boolean;

  isCreditCardVisa(data: any): boolean;

  isCreditCardMastercard(data: any): boolean;

  isCreditCardAmericanExpress(data: any): boolean;

  isCreditCardDiscover(data: any): boolean;

  isArray(data: any): boolean;

  isEmpty(data: any): boolean;

  isNotEmpty(data: any): boolean;

  isPersonTaxNumber(data: any): boolean;

  isColorCode(data: any): boolean;

  isIbanCode(data: any): boolean;

  isSwiftCode(data: any): boolean;
}
