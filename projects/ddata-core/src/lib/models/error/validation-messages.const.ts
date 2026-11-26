const invalidFormatMessage = 'Az érték formátuma nem megfelelő.';
const requiredMessage = 'A mező kitöltése kötelező.';

/**
 * Default Hungarian validation messages by rule key (the part of the rule before the `:`).
 * `{value}` is replaced with the parameter of the rule (e.g. 3 for `min:3`).
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const DEFAULT_VALIDATION_MESSAGES: Readonly<Record<string, string>> = Object.freeze({
  required: requiredMessage,
  not_empty: requiredMessage,
  string: 'Szöveget adj meg.',
  number: 'Számot adj meg.',
  integer: 'Egész számot adj meg.',
  boolean: 'Igen vagy nem értéket adj meg.',
  not_zero: 'Az érték nem lehet nulla.',
  min: 'Kisebb, mint a minimum ({value}).',
  max: 'Nagyobb, mint a maximum ({value}).',
  email: 'Adj meg érvényes e-mail-címet.',
  url: 'Adj meg érvényes webcímet.',
  domain: 'Adj meg érvényes domainnevet.',
  iso_date: 'Adj meg érvényes dátumot (ÉÉÉÉ-HH-NN).',
  phonenumber: 'Adj meg érvényes telefonszámot.',
  color_code: 'Adj meg érvényes színkódot, például #0a58ca.',
  array: 'Listát adj meg.',
  empty: 'A mezőnek üresnek kell lennie.',
  name: invalidFormatMessage,
  lang: invalidFormatMessage,
  register_number: invalidFormatMessage,
  driving_licence: invalidFormatMessage,
  id_card_number: invalidFormatMessage,
  address_card_number: invalidFormatMessage,
  bankaccount: invalidFormatMessage,
  taxnumber: invalidFormatMessage,
  person_taxnumber: invalidFormatMessage,
  social_insurance_number: invalidFormatMessage,
  iban_code: invalidFormatMessage,
  swift_code: invalidFormatMessage,
  invalid: invalidFormatMessage
});
