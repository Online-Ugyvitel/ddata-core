# Ddata a11y

Accessibility package for Angular projects.

## Color contrast ration helper

### Find accessible text color pair

Find out the right foreground color programatically for any background color what will pass on
[jasmine-axe](https://github.com/theodo/jasmine-axe) tests.

Usage:

```typescript
import { A11yColor } from '@netdjw/ddata-a11y';

const backgroundColor = 'bada55';
const textColor = new A11yColor()
  .setBackgroundColor(backgroundColor)
  .getTextColor();
```

### Check contrast ratio

Find out the contrast ration for color pairs:

```typescript
import { A11yColor } from '@netdjw/ddata-a11y';

const backgroundColor = 'c0ffee';
const textColor = 'facade';
const contrastRatio = new A11yColor()
  .setBackgroundColor(backgroundColor)
  .getContrastRatioWith(textColor);
```

### Get contrast ratio

Calculates contrast ratio between two hex strings.

```typescript
import { A11yColor } from '@netdjw/ddata-a11y';

const color1 = '4cc355';
const color2 = 'fa113d';
const contrastRatio = new A11yColor()
  .getContrastRatioBetween(color1, color2);
```

### Get color luminance

Returns luminance as a number between 0 and 1.

```typescript
const color = 'c0de25';
const luminance = new A11yColor()
  .setBackgroundColor(color)
  .luminance();
```

## Thanks

- [Karen Ying](https://blog.karenying.com/posts/boost-visual-accessibility-by-auto-flipping-text-color)
