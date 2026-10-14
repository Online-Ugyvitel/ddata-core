import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, PLATFORM_ID, Signal, signal } from '@angular/core';

/**
 * Height of a view container what fills the window below a fixed offset (header, toolbar, etc.).
 * It has to be created in an injection context; call `update()` when the window is resized.
 * Outside the browser (SSR) there is no window, so the height stays `null` (no fixed height).
 */
export class ViewportHeight {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly viewport = signal<number | null>(null);

  readonly height: Signal<number | null>;

  /**
   * @param offset the space above and below the container in pixels, `null` disables the fixed height
   */
  constructor(offset: Signal<number | null>) {
    this.height = computed(() => {
      const viewport = this.viewport();
      const offsetValue = offset();

      return viewport === null || offsetValue === null ? null : Math.max(0, viewport - offsetValue);
    });
    this.update();
  }

  update(): void {
    if (this.isBrowser) {
      this.viewport.set(this.document.documentElement.clientHeight);
    }
  }
}
