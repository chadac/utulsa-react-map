var keyMirror = require('keymirror');

var constants = keyMirror({
  APP_STATE_SET: null,
  APP_STATE_RESET: null,
});

constants.states = keyMirror({
  NORMAL: null,
  SEARCH: null,
});
