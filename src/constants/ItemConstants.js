/**
 * Constants used for dispatching actions to the Item Store.
 *
 * @module ItemConstants
 */
import keyMirror from 'keymirror';

const ItemConstants = keyMirror({
  ITEM_CREATE: null,
  ITEM_DESTROY: null,
  ITEM_SELECT: null,
  ITEM_DESELECT: null,
  ITEM_FOCUS: null,
  ITEM_UNFOCUS: null,
  ITEM_OPEN_INFOWINDOW: null,
  ITEM_CLOSE_INFOWINDOW: null,
  ITEM_SEARCH: null,
  ITEM_RESET_SEARCH: null,
  ADD_CATEGORY: null,
  REM_CATEGORY: null,
  RESET_CATEGORIES: null,
});

export default ItemConstants;
