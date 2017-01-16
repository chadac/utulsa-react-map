import ItemConstants from '../../constants/ItemConstants';
import GMapsConstants from '../../constants/GMapsConstants';
jest.mock('../../GMapsAPI')
jest.mock('../../dispatcher/AppDispatcher')

describe('ItemStore', () => {
  var ItemStore;

  const dispatch = (actionType, args) => {
    let action = Object.assign({actionType: actionType}, args);
    ItemStore.dispatch(action);
  }

  const create = (id, attrs) => {
    let data = Object.assign(
      {id: id, name: id, type: 'test', gmaps: {min_zoom: 0, max_zoom: 19}},
      attrs
    );
    dispatch(ItemConstants.ITEM_CREATE, {data: data});
  };
  const destroy = (id) => dispatch(ItemConstants.ITEM_DESTROY, {id: id});
  const select = (id) => dispatch(ItemConstants.ITEM_SELECT, {id: id});
  const deselect = () => dispatch(ItemConstants.ITEM_DESELECT);
  const openInfoWindow = (id) => dispatch(ItemConstants.ITEM_OPEN_INFOWINDOW, {id: id});
  const closeInfoWindow = () => dispatch(ItemConstants.ITEM_CLOSE_INFOWINDOW);
  const search = (word) => dispatch(ItemConstants.ITEM_SEARCH, {word: word});
  const resetSearch = () => dispatch(ItemConstants.ITEM_RESET_SEARCH);
  const addCategory = (category) => dispatch(ItemConstants.ADD_CATEGORY, {category: category});
  const remCategory = (category) => dispatch(ItemConstants.REM_CATEGORY, {category: category});
  const resetCategories = () => dispatch(ItemConstants.RESET_CATEGORIES);

  beforeEach(function() {
    ItemStore = require('../ItemStore').default;
  });

  describe("#register", () => {
    it('intializes with no items', () => {
      var all = ItemStore.getAll();
      expect(all).toEqual([]);
    });

    it('creates a single item', () => {
      create('item1');
      expect(ItemStore.hasItem('item1')).toBe(true);

      var item1 = ItemStore.getItemState('item1');
      expect(item1.$selected).toBeFalsy();
      expect(item1.$infoWindow).toBeFalsy();
    });

    it('destroys an item', () => {
      create('item1');
      destroy('item1');
      expect(ItemStore.hasItem('item1')).toBeFalsy();
    });

    it('selects an item', () => {
      create('item1');
      create('item2');
      create('item3');

      // Test that it reverts previous selections
      select('item2');
      // And affects infowindow state as well
      openInfoWindow('item3');
      // Then select this item
      select('item1');

      var item1 = ItemStore.getItemState('item1');
      var item2 = ItemStore.getItemState('item2');
      var item3 = ItemStore.getItemState('item3');

      expect(item1.$selected).toBe(true);
      expect(item1.$infoWindow).toBe(true);
      expect(item2.$selected).toBe(false);
      expect(item2.$infoWindow).toBe(false);
      expect(item3.$selected).toBe(false);
      expect(item3.$infoWindow).toBe(false);
      expect(ItemStore.getSelected()).toBe('item1');
      expect(ItemStore.getInfoWindow()).toBe('item1');
    });

    it("deselects items", () => {
      create('item1');
      select('item1');
      deselect();

      var item1 = ItemStore.getItemState('item1');

      expect(item1.$selected).toBe(false);
      expect(item1.$infoWindow).toBe(false);
    });

    it("opens the info window", () => {
      create('item1');
      create('item2');
      openInfoWindow('item2');
      openInfoWindow('item1');

      var item1 = ItemStore.getItemState('item1');
      var item2 = ItemStore.getItemState('item2');

      expect(item1.$infoWindow).toBe(true);
      expect(item2.$infoWindow).toBe(false);
    });

    it("closes the info window", () => {
      create('item1');
      create('item1');
      closeInfoWindow();

      var item1 = ItemStore.getItemState('item1');

      expect(item1.$infoWindow).toBe(false);
    });
  });

  describe("#emitChange", () => {
    var mockCallback;

    const numCalls = () => mockCallback.mock.calls.length;

    beforeEach(() => {
      mockCallback = jest.fn();
      ItemStore.addChangeListener(mockCallback);
    });

    it("triggers on ITEM_CREATE", () => {
      create('item1');
      expect(numCalls()).toBe(1);
    });

    it("triggers on ITEM_DESTROY", () => {
      create('item1');
      destroy('item1');
      expect(numCalls()).toBe(2);
    });
  });

  describe('#emitStateChange', () => {
    var mockCallback;

    const numCalls = (i) => mockCallback[i].mock.calls.length;

    beforeEach(() => {
      mockCallback = {item1: jest.fn(), item2: jest.fn()};
      ItemStore.addStateChangeListener(mockCallback.item1, 'item1');
      ItemStore.addStateChangeListener(mockCallback.item2, 'item2');
    });

    it("triggers on select", () => {
      create('item1');
      create('item2');

      // Triggers select only on item1
      select('item1');
      expect(numCalls('item1')).toBe(1);
      expect(numCalls('item2')).toBe(0);

      // Triggers deselect on item1, select on item2
      select('item2');
      expect(numCalls('item1')).toBe(2);
      expect(numCalls('item2')).toBe(1);
    });

    it("triggers on deselect", () => {
      create('item1');

      // Triggers on both select and deselect
      select('item1');
      deselect('item1');
      expect(numCalls('item1')).toBe(2);
    });

    it("triggers on open info window", () => {
      create('item1');
      create('item2');

      openInfoWindow('item1');
      expect(numCalls('item1')).toBe(1);
      expect(numCalls('item2')).toBe(0);

      openInfoWindow('item2');
      expect(numCalls('item1')).toBe(1);
      expect(numCalls('item2')).toBe(1);
    });

    it("triggers on search", () => {
      create('item1', {name: 'test'});

      search('test');
      expect(numCalls('item1')).toBe(1);
    });

    it("triggers on reset search", () => {
      create('item1');

      search('item');
      resetSearch();
      expect(numCalls('item1')).toBe(2);
    });

    // TODO: Fix these calls so that they do something useful
    /* it("triggers on add category", () => {
     *   create('item1', {category: 'a'});

     *   // Marks category 'a' as active
     *   addCategory('a');
     *   expect(numCalls('item1')).toBe(1);
     * });

     * it("triggers on remove category", () => {
     *   create('item1', {category: 'a'});

     *   addCategory('a');
     *   remCategory('a');
     *   expect(numCalls('item1')).toBe(2);
     * });

     * it("triggers on reset categories", () => {
     *   create('item1', {category: 'a'});

     *   addCategory('a');
     *   resetCategories();
     *   expect(numCalls('item1')).toBe(2);
     * });*/

    // TODO: Add google maps zoom event.
  });

  describe("#emitSelect", () => {
    var mockCallback;
    const numCalls = () => mockCallback.mock.calls.length;

    beforeEach(() => {
      mockCallback = jest.fn();
      ItemStore.addSelectListener(mockCallback, 'item1');
    });

    it("triggers on ITEM_SELECT", () => {
      create('item1');
      select('item1');

      expect(numCalls()).toBe(1);
    });

    it("triggers on ITEM_DESELECT", () => {
      create('item1');
      select('item1');
      deselect();

      expect(numCalls()).toBe(2);
    });
  });

  describe('#search', () => {
    it('searches for items', () => {
      create('item1');
      create('item2');
      create('the third one');
      search('item');
      const item1 = ItemStore.getItemState('item1'),
            item2 = ItemStore.getItemState('item2'),
            item3 = ItemStore.getItemState('the third one');
      expect(item1.search.$active).toBeTruthy();
      expect(item2.search.$active).toBeTruthy();
      expect(item3.search.$active).toBeFalsy();
    });

    it('resets on new searches', () => {
      create('item1');
      create('item2');
      create('the third one');
      let item1 = ItemStore.getItemState('item1'),
          item2 = ItemStore.getItemState('item2'),
          item3 = ItemStore.getItemState('the third one');

      search('item');
      expect(item1.search.$active).toBeTruthy();
      expect(item2.search.$active).toBeTruthy();
      expect(item3.search.$active).toBeFalsy();

      search('the');
      expect(item1.search.$active).toBeFalsy();
      expect(item2.search.$active).toBeFalsy();
      expect(item3.search.$active).toBeTruthy();
    });

    it('slices by space', () => {
      create('Hello World!');
      const item = ItemStore.getItemState('Hello World!');

      search('He');
      expect(item.search.$active).toBeTruthy();

      search('Wo');
      expect(item.search.$active).toBeTruthy();

      search('ojkk');
      expect(item.search.$active).toBeFalsy();
    });

    it('resets searches', () => {
      create('item1');
      const item1 = ItemStore.getItemState('item1');

      search('item');
      expect(item1.search.$active).toBeTruthy();

      resetSearch();
      expect(item1.search.$active).toBeFalsy();
    });
  });
});
