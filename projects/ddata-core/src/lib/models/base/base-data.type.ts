declare const addressCardNumber: unique symbol;
export declare type AddressCardNumber = string & {
  readonly [addressCardNumber]: 'AddressCardNumber';
};

declare const accountAssignmentNumber: unique symbol;
export declare type AccountAssignmentNumber = string & {
  readonly [accountAssignmentNumber]: 'AccountAssignmentNumber';
};

declare const amountOfCredits: unique symbol;
export declare type AmountOfCredits = number & { readonly [amountOfCredits]: 'AmountOfCredits' };

declare const amountOfMoney: unique symbol;
export declare type AmountOfMoney = number & { readonly [amountOfMoney]: 'AmountOfMoney' };

declare const amountOfProduct: unique symbol;
export declare type AmountOfProduct = number & { readonly [amountOfProduct]: 'AmountOfProduct' };

declare const bankAccountNumber: unique symbol;
export declare type BankAccountNumber = string & {
  readonly [bankAccountNumber]: 'BankAccountNumber';
};

declare const barcodeEAN13: unique symbol;
export declare type BarcodeEAN13 = string & { readonly [barcodeEAN13]: 'BarcodeEAN13' };

declare const barcodeCode93: unique symbol;
export declare type BarcodeCode93 = string & { readonly [barcodeCode93]: 'BarcodeCode93' };

declare const barcodeCode128: unique symbol;
export declare type BarcodeCode128 = string & { readonly [barcodeCode128]: 'BarcodeCode128' };

declare const certificationNumber: unique symbol;
export declare type CertificationNumber = string & {
  readonly [certificationNumber]: 'CertificationNumber';
};

declare const certificationTitle: unique symbol;
export declare type CertificationTitle = string & {
  readonly [certificationTitle]: 'CertificationTitle';
};

declare const colorHexaCode: unique symbol;
export declare type ColorHexaCode = string & { readonly [colorHexaCode]: 'ColorHexaCode' };

declare const countryCode: unique symbol;
export declare type CountryCode = string & { readonly [countryCode]: 'CountryCode' };

declare const csvDataLine: unique symbol;
export declare type CSVDataLine = string & { readonly [csvDataLine]: 'CSVDataLine' };

declare const csvSeparator: unique symbol;
export declare type CSVSeparator = ';' | ',' | ' ' | '|' | '.' | '\t';

declare const dataType: unique symbol;
export declare type DataType = 'string' | 'integer' | 'float' | 'array' | 'boolean';

declare const dayOfWeek: unique symbol;
export declare type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

declare const days: unique symbol;
export declare type Days = number & { readonly [days]: 'Days' };

declare const decimalNumber: unique symbol;
export declare type DecimalNumber = number & { readonly [decimalNumber]: 'DecimalNumber' };

declare const description: unique symbol;
export declare type Description = string & { readonly [description]: 'Description' };

declare const devizaCode: unique symbol;
export declare type DevizaCode = string & { readonly [devizaCode]: 'DevizaCode' };

declare const devizaSymbol: unique symbol;
export declare type DevizaSymbol = string & { readonly [devizaSymbol]: 'DevizaSymbol' };

declare const drivingLicenceID: unique symbol;
export declare type DrivingLicenceID = string & { readonly [drivingLicenceID]: 'DrivingLicenceID' };

declare const email: unique symbol;
export declare type Email = string & { readonly [email]: 'Email' };

declare const encodingName: unique symbol;
export declare type EncodingName =
  | 'ASCII'
  | 'UTF-8'
  | 'UTF-16'
  | 'Windows-1251'
  | 'Windows-1252'
  | 'ISO-8859-1'
  | 'ISO-8859-2'
  | 'ISO-8859-3'
  | 'ISO-8859-4'
  | 'ISO-8859-5'
  | 'ISO-8859-6'
  | 'ISO-8859-7'
  | 'ISO-8859-8'
  | 'ISO-8859-9'
  | 'ISO-8859-10'
  | 'ISO-8859-13'
  | 'ISO-8859-14'
  | 'ISO-8859-15'
  | 'KOI8-R';

declare const fileSizeInByte: unique symbol;
export declare type FileSizeInByte = number & { readonly [fileSizeInByte]: 'FileSizeInByte' };

declare const fileName: unique symbol;
export declare type FileName = string & { readonly [fileName]: 'FileName' };

declare const fileNameSlug: unique symbol;
export declare type FileNameSlug = string & { readonly [fileNameSlug]: 'FileNameSlug' };

declare const fileNameWithPath: unique symbol;
export declare type FileNameWithPath = string & { readonly [fileNameWithPath]: 'FileNameWithPath' };

declare const foreignAPIStatus: unique symbol;
export declare type ForeignAPIStatus = 'Unprocessed' | 'Pending' | 'Failed' | 'OK';

declare const healthFundNumber: unique symbol;
export declare type HealthFundNumber = string & { readonly [healthFundNumber]: 'HealthFundNumber' };

declare const historyEventTitle: unique symbol;
export declare type HistoryEventTitle = string & {
  readonly [historyEventTitle]: 'HistoryEventTitle';
};

declare const historyEventDescription: unique symbol;
export declare type HistoryEventDescription = string & {
  readonly [historyEventDescription]: 'HistoryEventDescription';
};

declare const ibanCode: unique symbol;
export declare type IbanCode = string & { readonly [ibanCode]: 'IbanCode' };

declare const id: unique symbol;
export declare type ID = number & { readonly [id]: 'ID' };

declare const identityCardNumber: unique symbol;
export declare type IdentityCardNumber = string & {
  readonly [identityCardNumber]: 'IdentityCardNumber';
};

declare const itemNumber: unique symbol;
export declare type ItemNumber = string & { readonly [itemNumber]: 'ItemNumber' };

declare const isoDate: unique symbol;
export declare type ISODate = string & { readonly [isoDate]: 'ISODate' };

declare const jobPosition: unique symbol;
export declare type JobPosition = string & { readonly [jobPosition]: 'JobPosition' };

declare const ipAddress: unique symbol;
export declare type IPAddress = string & { readonly [ipAddress]: 'IPAddress' };

declare const languageCode_ISO_639_1: unique symbol;
export declare type LanguageCode_ISO_639_1 =
  | 'aa'
  | 'ab'
  | 'ae'
  | 'af'
  | 'ak'
  | 'am'
  | 'an'
  | 'ar'
  | 'as'
  | 'av'
  | 'ay'
  | 'az'
  | 'ba'
  | 'be'
  | 'bg'
  | 'bh'
  | 'bi'
  | 'bm'
  | 'bn'
  | 'bo'
  | 'br'
  | 'bs'
  | 'ca'
  | 'ce'
  | 'ch'
  | 'co'
  | 'cr'
  | 'cs'
  | 'cu'
  | 'cv'
  | 'cy'
  | 'da'
  | 'de'
  | 'dv'
  | 'dz'
  | 'ee'
  | 'el'
  | 'en'
  | 'eo'
  | 'es'
  | 'et'
  | 'eu'
  | 'fa'
  | 'ff'
  | 'fi'
  | 'fj'
  | 'fo'
  | 'fr'
  | 'fy'
  | 'ga'
  | 'gd'
  | 'gl'
  | 'gn'
  | 'gu'
  | 'gv'
  | 'ha'
  | 'he'
  | 'hi'
  | 'ho'
  | 'hr'
  | 'ht'
  | 'hu'
  | 'hy'
  | 'hz'
  | 'ia'
  | 'id'
  | 'ie'
  | 'ig'
  | 'ii'
  | 'ik'
  | 'io'
  | 'is'
  | 'it'
  | 'iu'
  | 'ja'
  | 'jv'
  | 'ka'
  | 'kg'
  | 'ki'
  | 'kj'
  | 'kk'
  | 'kl'
  | 'km'
  | 'kn'
  | 'ko'
  | 'kr'
  | 'ks'
  | 'ku'
  | 'kv'
  | 'kw'
  | 'ky'
  | 'la'
  | 'lb'
  | 'lg'
  | 'li'
  | 'ln'
  | 'lo'
  | 'lt'
  | 'lu'
  | 'lv'
  | 'mg'
  | 'mh'
  | 'mi'
  | 'mk'
  | 'ml'
  | 'mn'
  | 'mr'
  | 'ms'
  | 'mt'
  | 'my'
  | 'na'
  | 'nb'
  | 'nd'
  | 'ne'
  | 'ng'
  | 'nl'
  | 'nn'
  | 'no'
  | 'nr'
  | 'nv'
  | 'ny'
  | 'oc'
  | 'oj'
  | 'om'
  | 'or'
  | 'os'
  | 'pa'
  | 'pi'
  | 'pl'
  | 'ps'
  | 'pt'
  | 'qu'
  | 'rm'
  | 'rn'
  | 'ro'
  | 'ru'
  | 'rw'
  | 'sa'
  | 'sc'
  | 'sd'
  | 'se'
  | 'sg'
  | 'si'
  | 'sk'
  | 'sl'
  | 'sm'
  | 'sn'
  | 'so'
  | 'sq'
  | 'sr'
  | 'ss'
  | 'st'
  | 'su'
  | 'sv'
  | 'sw'
  | 'ta'
  | 'te'
  | 'tg'
  | 'th'
  | 'ti'
  | 'tk'
  | 'tl'
  | 'tn'
  | 'to'
  | 'tr'
  | 'ts'
  | 'tt'
  | 'tw'
  | 'ty'
  | 'ug'
  | 'uk'
  | 'ur'
  | 'uz'
  | 've'
  | 'vi'
  | 'vo'
  | 'wa'
  | 'wo'
  | 'xh'
  | 'yi'
  | 'yo'
  | 'za'
  | 'zh'
  | 'zu';

declare const mimeType: unique symbol;
export declare type MimeType = string & { readonly [mimeType]: 'MimeType' };

declare const month: unique symbol;
export declare type Month = number & { readonly [month]: 'Month' };

declare const noteTitle: unique symbol;
export declare type NoteTitle = string & { readonly [noteTitle]: 'NoteTitle' };

declare const notificationType: unique symbol;
export declare type NotificationType = string & { readonly [notificationType]: 'NotificationType' };

declare const orderNumber: unique symbol;
export declare type OrderNumber = number & { readonly [orderNumber]: 'OrderNumber' };

declare const partnerCode: unique symbol;
export declare type PartnerCode = string & { readonly [partnerCode]: 'PartnerCode' };

declare const passportNumber: unique symbol;
export declare type PassportNumber = string & { readonly [passportNumber]: 'PassportNumber' };

declare const password: unique symbol;
export declare type Password = string & { readonly [password]: 'Password' };

declare const percent: unique symbol;
export declare type Percent = number & { readonly [percent]: 'Percent' };

declare const personName: unique symbol;
export declare type PersonName = string & { readonly [personName]: 'PersonName' };

declare const personTaxNumber: unique symbol;
export declare type PersonTaxNumber = string & { readonly [personTaxNumber]: 'PersonTaxNumber' };

declare const phoneNumber: unique symbol;
export declare type PhoneNumber = string & { readonly [phoneNumber]: 'PhoneNumber' };

declare const prefixString: unique symbol;
export declare type PrefixString = string & { readonly [prefixString]: 'PrefixString' };

declare const prefixStartNumber: unique symbol;
export declare type PrefixStartNumber = number & {
  readonly [prefixStartNumber]: 'PrefixStartNumber';
};

declare const priority: unique symbol;
export declare type Priority = number & { readonly [priority]: 'Priority' };

declare const registerNumber: unique symbol;
export declare type RegisterNumber = string & { readonly [registerNumber]: 'RegisterNumber' };

declare const reminderType: unique symbol;
export declare type ReminderType = 'email' | 'sms' | 'inner-notification' | 'slack';

declare const serialNumber: unique symbol;
export declare type SerialNumber = string & { readonly [serialNumber]: 'SerialNumber' };

declare const socialInsuranceNumber: unique symbol;
export declare type SocialInsuranceNumber = string & {
  readonly [socialInsuranceNumber]: 'SocialInsuranceNumber';
};

declare const swiftCode: unique symbol;
export declare type SwiftCode = string & { readonly [swiftCode]: 'SwiftCode' };

declare const tagCode: unique symbol;
export declare type TagCode = string & { readonly [tagCode]: 'TagCode' };

declare const taxNumber: unique symbol;
export declare type TaxNumber = string & { readonly [taxNumber]: 'TaxNumber' };

declare const taxNumberEu: unique symbol;
export declare type TaxNumberEu = string & { readonly [taxNumberEu]: 'TaxNumberEu' };

declare const time: unique symbol;
export declare type Time = string & { readonly [time]: 'Time' };

declare const timestamp: unique symbol;
export declare type Timestamp = string & { readonly [timestamp]: 'Timestamp' };

declare const unit: unique symbol;
export declare type Unit = string & { readonly [unit]: 'Unit' };

declare const url: unique symbol;
export declare type URL = string & { readonly [url]: 'URL' };

declare const uri: unique symbol;
export declare type URI = string & { readonly [uri]: 'URI' };

declare const userName: unique symbol;
export declare type UserName = string & { readonly [userName]: 'UserName' };

declare const uuid: unique symbol;
export declare type UUID = string & { readonly [uuid]: 'UUID' };

declare const valueOfDenomination: unique symbol;
export declare type ValueOfDenomination = number & {
  readonly [valueOfDenomination]: 'ValueOfDenomination';
};

declare const weekDayName: unique symbol;
export declare type WeekDayName =
  | 'hétfő'
  | 'kedd'
  | 'szerda'
  | 'csütörtök'
  | 'péntek'
  | 'szombat'
  | 'vasárnap'
  | 'Hétfő'
  | 'Kedd'
  | 'Szerda'
  | 'Csütörtök'
  | 'Péntek'
  | 'Szombat'
  | 'Vasárnap';

declare const zipCode: unique symbol;
export declare type ZipCode = string & { readonly [zipCode]: 'ZipCode' };
