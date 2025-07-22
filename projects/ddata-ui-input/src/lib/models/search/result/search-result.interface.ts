import { ID } from 'ddata-core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface SearchResultInterface {
  /**
   * id of the found item
   */
  id: ID;
  /**
   * Name of the found item
   */
  name: string;

  /**
   * Description of the result.
   */
  description: string;

  /**
   * The name of the table from which the result comes.
   */
  type: string;

  /**
   * The found model's name.
   */
  found_model_name: string;

  // a keresési eredmény előtt megjelenő ikon, vizuálisan jelzi a usernek, hogy a találat a program melyik részéhez tartozik
  /**
   * FontAwesome icon which shown before the result. It's a visual sign for the user to represent, the result which kind
   * of data belongs to.
   */
  icon: IconDefinition;

  /**
   * URL for the result. The results shown as a link to this URL.
   */
  url: string;

  init(data?: unknown): SearchResultInterface;
}
