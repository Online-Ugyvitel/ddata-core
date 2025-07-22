export interface SorterServiceInterface<T> {
  /**
   * Sort to ascending an array of objects, based on a defined key.
   *
   * @param objects array of objects
   * @param key object's key to sort
   */
  sortBy(objects: Array<T>, key: string): Array<T>;

  /**
   * Sort to descending an array of objects, based on a defined key.
   * @param objects array of objects
   * @param key object's key to sort
   */
  sortByDesc(objects: Array<T>, key: string): Array<T>;
}
