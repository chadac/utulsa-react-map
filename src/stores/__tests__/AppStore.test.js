import ItemConstants from '../../constants/ItemConstants';
import GMapsConstants from '../../constants/GMapsConstants';
import AppConstants from '../../constants/AppConstants';
import AppState from '../../constants/AppState';
jest.mock('../../GMapsAPI')
jest.mock('../../dispatcher/AppDispatcher');

describe('AppStore', () => {
  var AppStore;

  const dispatch = (actionType, args) => {
    let action = Object.assign({actionType: actionType}, args);
    AppStore.dispatch(action);
  }

  const setState = (state) => dispatch(AppConstants.APP_SET_STATE, {state: state});
  const select = () => dispatch(ItemConstants.ITEM_SELECT);
  const deselect = () => dispatch(ItemConstants.ITEM_DESELECT);
  const closeInfoWindow = () => dispatch(ItemConstants.ITEM_CLOSE_INFOWINDOW);
  const search = (word) => dispatch(ItemConstants.ITEM_SEARCH, {word: word});
  const resetSearch = () => dispatch(ItemConstants.ITEM_RESET_SEARCH);

  beforeEach(function() {
    AppStore = require('../AppStore').default;
  });

  describe("#dispatch", () => {
    it("initialized with AppState.NORMAL", () => {
      expect(AppStore.getState()).toBe(AppState.NORMAL);
    });

    it("changes state with setState", () => {
      setState("test_state1");

      expect(AppStore.getState()).toBe("test_state1");
    });

    it("changes to select state on item select", () => {
      select();

      expect(AppStore.getState()).toBe(AppState.SELECT);
    });

    it("changes to normal state on item deselect", () => {
      select();
      expect(AppStore.getState()).toBe(AppState.SELECT);

      deselect();
      expect(AppStore.getState()).toBe(AppState.NORMAL);
    });

    it("changes to normal state when closing infowindow", () => {
      select();
      closeInfoWindow();
      expect(AppStore.getState()).toBe(AppState.NORMAL);

      setState("test");
      closeInfoWindow();
      expect(AppStore.getState()).toBe("test");
    });

    it("changes to search state when searching", () => {
      search("test");
      expect(AppStore.getState()).toBe(AppState.SEARCH);
    });

    it("changes to normal state when resetting from search", () => {
      search("test");
      resetSearch();
      expect(AppStore.getState()).toBe(AppState.NORMAL);
    });

    it("does not reset to normal when resetting search from non-search state", () => {
      setState("test");
      resetSearch();
      expect(AppStore.getState()).toBe("test");
    });
  });
});
