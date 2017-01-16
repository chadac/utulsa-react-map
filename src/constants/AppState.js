/**
 * Contains the possible states that the application can have.
 *
 * @module AppState
 */
import keyMirror from 'keymirror';

const AppState = keyMirror({
  NORMAL: null,
  SEARCH: null,
  SELECT: null,
  FILTER: null,
});

export default AppState;
