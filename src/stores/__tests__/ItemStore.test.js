jest.mock('../../dispatcher/AppDispatcher');

describe('ItemStore', () => {
  var ItemConstants = require('../../constants/ItemConstants');

  //TODO: Move something like this over to `ItemActions` so that
  //      I don't have to rewrite everything
  var actionItemCreate = (id) => {
    return {
      source: 'VIEW_ACTION',
      action: {
        actionType: ItemConstants.ITEM_CREATE,
        data: {id: id, name: id, gmaps: {}}
      },
    };
  };
  var actionItemDestroy = (id) => {
    return {
      source: 'VIEW_ACTION',
      action: {
        actionType: ItemConstants.ITEM_DESTROY,
        id: id
      },
    };
  };
  var actionItemSelect = (id) => {
    return {
      source: 'VIEW_ACTION',
      action: {
        actionType: ItemConstants.ITEM_SELECT,
        id: 'item1',
      },
    };
  };
  var actionItemDeselect = () => {
    return {
      source: 'VIEW_ACTION',
      action: {
        actionType: ItemConstants.ITEM_DESELECT,
      },
    };
  };
  var actionItemOpenInfoWindow = (id) => {
    return {
      source: 'VIEW_ACTION',
      action: {
        actionType: ItemConstants.ITEM_OPEN_INFOWINDOW,
        id: id
      },
    };
  };
  var actionItemCloseInfoWindow = () => {
    return {
      source: 'VIEW_ACTION',
      action: {
        actionType: ItemConstants.ITEM_CLOSE_INFOWINDOW,
      },
    };
  };

  var AppDispatcher;
  var ItemStore;
  var callback;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/AppDispatcher');
    ItemStore = require('../ItemStore');
    // Grabs the ItemStore action processing method
    callback = AppDispatcher.register.mock.calls[1][0];
  });

  describe("#register", () => {
    it('intializes with no items', () => {
      var all = ItemStore.getAll();
      expect(all).toEqual([]);
    });

    it('creates a single item', () => {
      callback(actionItemCreate('item1'));
      expect(ItemStore.hasItem('item1')).toBe(true);

      var item1 = ItemStore.getItem('item1');
      expect(item1.$selected).toBeFalsy();
      expect(item1.$infoWindow).toBeFalsy();
    });

    it('destroys an item', () => {
      callback(actionItemCreate('item1'));
      callback(actionItemDestroy('item1'));
      expect(ItemStore.hasItem('item1')).toBeFalsy();
    });

    it('selects an item', () => {
      callback(actionItemCreate('item1'));
      callback(actionItemCreate('item2'));
      callback(actionItemCreate('item3'));

      // Test that it reverts previous selections
      callback(actionItemSelect('item2'));
      // And affects infowindow state as well
      callback(actionItemOpenInfoWindow('item3'));
      // Then select this item
      callback(actionItemSelect('item1'));

      var item1 = ItemStore.getItem('item1');
      var item2 = ItemStore.getItem('item2');
      var item3 = ItemStore.getItem('item3');

      expect(item1.$selected).toBe(true);
      expect(item1.$infoWindow).toBe(true);
      expect(item2.$selected).toBe(false);
      expect(item2.$infoWindow).toBe(false);
      expect(item3.$selected).toBe(false);
      expect(item3.$infoWindow).toBe(false);
      expect(ItemStore.getSelected()).toBe(item1.id);
      expect(ItemStore.getInfoWindow()).toBe(item1.id);
    });

    it("deselects items", () => {
      callback(actionItemCreate('item1'));
      callback(actionItemSelect('item1'));
      callback(actionItemDeselect());

      var item1 = ItemStore.getItem('item1');

      expect(item1.$selected).toBe(false);
      expect(item1.$infoWindow).toBe(false);
    });

    it("opens the info window", () => {
      callback(actionItemCreate('item1'));
      callback(actionItemCreate('item2'));
      callback(actionItemOpenInfoWindow('item2'));
      callback(actionItemOpenInfoWindow('item1'));

      var item1 = ItemStore.getItem('item1');
      var item2 = ItemStore.getItem('item2');

      expect(item1.$infoWindow).toBe(true);
      expect(item2.$infoWindow).toBe(false);
    });

    it("closes the info window", () => {
      callback(actionItemCreate('item1'));
      callback(actionItemOpenInfoWindow('item1'));
      callback(actionItemCloseInfoWindow());

      var item1 = ItemStore.getItem('item1');

      expect(item1.$infoWindow).toBe(false);
    });
  });

  describe("#emitChange", () => {
    var mockCallback;

    beforeEach(() => {
      mockCallback = jest.fn();
      ItemStore.addChangeListener(mockCallback);
    });

    it("triggers on ITEM_CREATE", () => {
      callback(actionItemCreate('item1'));
      expect(mockCallback.mock.calls.length).toBe(1);
    });

    it("triggers on ITEM_DESTROY", () => {
      callback(actionItemCreate('item1'));
      callback(actionItemDestroy('item1'));
      expect(mockCallback.mock.calls.length).toBe(2);
    });

    it("triggers on ITEM_SELECT", () => {
      callback(actionItemCreate('item1'));
      callback(actionItemSelect('item1'));
      expect(mockCallback.mock.calls.length).toBe(2);
    });

    it("triggers on ITEM_DESELECT", () => {
      callback(actionItemDeselect());
      expect(mockCallback.mock.calls.length).toBe(1);
    });

    it("triggers on ITEM_OPEN_INFOWINDOW", () => {
      callback(actionItemCreate('item1'));
      callback(actionItemOpenInfoWindow('item1'));
      expect(mockCallback.mock.calls.length).toBe(2);
    });

    it("triggers on ITEM_CLOSE_INFOWINDOW", () => {
      callback(actionItemCloseInfoWindow());

      expect(mockCallback.mock.calls.length).toBe(1);
    });
  });

  describe("#emitSelect", () => {
    var mockCallback;

    beforeEach(() => {
      mockCallback = jest.fn();
      ItemStore.addSelectListener('item1', mockCallback);
    });

    it("triggers on ITEM_SELECT", () => {
      callback(actionItemCreate('item1'));
      callback(actionItemSelect('item1'));

      expect(mockCallback.mock.calls.length).toBe(1);
    });

    it("triggers on ITEM_DESELECT", () => {
      callback(actionItemCreate('item1'));
      callback(actionItemSelect('item1'));
      callback(actionItemDeselect());

      expect(mockCallback.mock.calls.length).toBe(2);
    });
  });
});
