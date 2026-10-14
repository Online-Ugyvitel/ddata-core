/**
 * Any tabset component what has a list of tabs with an `active` flag, for example the ngx-bootstrap `TabsetComponent`.
 */
export interface TabsetInterface {
  tabs: Array<{ active?: boolean }>;
}

/**
 * The service what moves the active tab of a tabset.
 */
export interface TabNavigationServiceInterface {
  moveInTabsLeft(tabset: TabsetInterface): void;
  moveInTabsRight(tabset: TabsetInterface): void;
}
