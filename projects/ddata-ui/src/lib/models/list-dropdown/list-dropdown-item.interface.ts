import { DialogContentItem } from '@netdjw/ddata-ui-dialog';

/**
 * A custom menu item of the list dropdown. It navigates to the `link` or emits the `eventMsg`.
 */
export interface ListDropdownItemInterface {
  name: string;
  icon?: string;
  link?: string;
  eventMsg?: string;
}

/**
 * A menu item of the list dropdown what opens a dialog, for example to create a new related model.
 */
export interface ListDropdownDialogItemInterface {
  name: string;
  /**
   * The item is hidden when it is `false`. Default is visible.
   */
  visible?: boolean;
  /**
   * Called on click, the returned content is emitted with the `showModal` event.
   */
  createDialogContent: () => DialogContentItem;
}
