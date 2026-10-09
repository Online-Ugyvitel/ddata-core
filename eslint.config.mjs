import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jasminePlugin from 'eslint-plugin-jasmine';
import noNullPlugin from 'eslint-plugin-no-null';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import unicornPlugin from 'eslint-plugin-unicorn';

const require = createRequire(import.meta.url);
const rootDir = dirname(fileURLToPath(import.meta.url));

// ESLint 9 only reads flat configs. The rule sets stay in the .eslintrc.json files and are applied from here.
const readRc = (dir) => require(join(rootDir, dir, '.eslintrc.json'));

const projects = [
  'ddata-core',
  'ddata-ui',
  'ddata-ui-input',
  'ddata-ui-file',
  'ddata-ui-dialog',
  'ddata-ui-common',
  'ddata-a11y',
];

const scopes = [
  { dir: '.', prefix: 'src' },
  ...projects.map((project) => ({ dir: `projects/${project}`, prefix: `projects/${project}` })),
];

const plugins = {
  '@angular-eslint': angularPlugin,
  '@angular-eslint/template': angularTemplatePlugin,
  '@typescript-eslint': tsPlugin,
  jasmine: jasminePlugin,
  'no-null': noNullPlugin,
  prettier: prettierPlugin,
  unicorn: unicornPlugin,
};

const toGlobs = (prefix, patterns) =>
  patterns.map((pattern) => `${prefix}/${pattern.startsWith('**/') ? pattern : `**/${pattern}`}`);

const ruleExists = (name) => {
  const slash = name.lastIndexOf('/');

  if (slash === -1) {
    return true;
  }

  const pluginName = name.slice(0, slash);
  const plugin = pluginName === 'import' ? importPlugin : plugins[pluginName];

  return !!plugin?.rules?.[name.slice(slash + 1)];
};

// Rules that were removed from the plugins by the Angular 22 / ESLint 9 upgrade cannot be configured any more.
const mapRules = (rules = {}) => Object.fromEntries(Object.entries(rules).filter(([name]) => ruleExists(name)));

const angularRecommended = {
  '@angular-eslint/contextual-lifecycle': 'error',
  '@angular-eslint/no-empty-lifecycle-method': 'error',
  '@angular-eslint/no-input-rename': 'error',
  '@angular-eslint/no-inputs-metadata-property': 'error',
  '@angular-eslint/no-output-native': 'error',
  '@angular-eslint/no-output-on-prefix': 'error',
  '@angular-eslint/no-output-rename': 'error',
  '@angular-eslint/no-outputs-metadata-property': 'error',
  '@angular-eslint/use-pipe-transform-interface': 'error',
  '@angular-eslint/use-lifecycle-interface': 'warn',
};

const angularTemplateRecommended = {
  '@angular-eslint/template/banana-in-box': 'error',
  '@angular-eslint/template/eqeqeq': 'error',
  '@angular-eslint/template/no-negated-async': 'error',
};

const typescriptBase = [
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
];

const buildScope = ({ dir, prefix }) => {
  const rc = readRc(dir);
  const rootRc = dir === '.' ? rc : readRc('.');
  const rootOverrides = rootRc.overrides;
  const tsOverride = rootOverrides.find((o) => o.files.includes('*.ts') && !o.files.includes('*.spec.ts'));
  const specOverride = rootOverrides.find((o) => o.files.includes('*.spec.ts'));
  const htmlOverride = rootOverrides.find((o) => o.files.includes('*.html'));
  const componentHtmlOverride = rootOverrides.find((o) => o.files.includes('*.component.html'));
  const tsFiles = [`${prefix}/**/*.ts`];
  const htmlFiles = [`${prefix}/**/*.html`];
  const settings = rootRc.settings;

  const configs = [
    ...typescriptBase.map((config) => ({ ...config, files: tsFiles })),
    {
      files: tsFiles,
      languageOptions: {
        parser: tsParser,
        parserOptions: { project: ['./tsconfig.json'], sourceType: 'module' },
      },
      plugins,
      settings,
      processor: '@angular-eslint/template/extract-inline-html',
      rules: {
        ...angularRecommended,
        'prettier/prettier': 'error',
        ...prettierConfig.rules,
        ...mapRules(tsOverride.rules),
        ...mapRules(rc === rootRc ? {} : rc.rules),
      },
    },
    {
      files: toGlobs(prefix, ['*.spec.ts']),
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ...specOverride.parserOptions,
          project: [dir === '.' ? './tsconfig.spec.json' : `./${dir}/tsconfig.spec.json`],
        },
      },
      plugins,
      rules: {
        ...jasminePlugin.configs.recommended.rules,
        ...mapRules(specOverride.rules),
        ...mapRules(rc === rootRc ? {} : rc.rules),
      },
    },
    {
      files: htmlFiles,
      languageOptions: { parser: angularTemplateParser },
      plugins,
      rules: {
        ...angularTemplateRecommended,
        ...mapRules(htmlOverride.rules),
      },
    },
    {
      files: toGlobs(prefix, ['*.component.html']),
      ignores: toGlobs(prefix, ['*inline-template-*.component.html']),
      languageOptions: { parser: angularTemplateParser },
      plugins,
      rules: { ...prettierConfig.rules, ...mapRules(componentHtmlOverride.rules) },
    },
  ];

  configs.push({
    files: [...toGlobs(prefix, ['*.spec.ts', 'test.ts']), `${prefix}/**/testing/**/*.ts`, `${prefix}/**/test-helpers/**/*.ts`],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  });

  configs.push({
    files: tsFiles,
    // the sibling ddata-* packages resolve to dist/, which only exists after they are built
    rules: { 'import/no-unresolved': ['error', { ignore: ['^ddata-'] }] },
  });

  if (dir === 'projects/ddata-ui-file') {
    configs.push({
      files: toGlobs(prefix, ['file.model.spec.ts']),
      rules: { 'jasmine/missing-expect': ['error', 'expect()', 'expectAsync()', 'expectLoose()'] },
    });
  }

  if (dir === 'projects/ddata-ui') {
    // ddata-ui still imports files of the consuming application (src/app/...) and private packages; the package is not part of the build yet.
    configs.push({
      files: tsFiles,
      rules: { 'import/no-unresolved': 'off', 'import/no-extraneous-dependencies': 'off' },
    });
  }

  if (rc !== rootRc) {
    for (const override of rc.overrides ?? []) {
      configs.push({
        files: toGlobs(prefix, override.files),
        rules: mapRules(override.rules),
        ...(override.env ? { languageOptions: { globals: { window: 'readonly', document: 'readonly' } } } : {}),
      });
    }
  }

  return configs;
};

export default [{ ignores: ['dist/**', 'node_modules/**', 'coverage/**'] }, ...scopes.flatMap(buildScope)];
