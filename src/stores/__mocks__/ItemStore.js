var ItemStore = jest.fn();

ItemStore.addChangeListener = jest.fn();
ItemStore.addCategoryChangeListener = jest.fn();
ItemStore.addStateChangeListener = jest.fn();
ItemStore.addSelectListener = jest.fn();

var items = {
  marker1: {
    id: 'marker1', name: 'Test Marker A',
    tags: ['a'], alternate_names: ['a'], departments: ['a'], rooms: ['a'],
    gmaps: {min_zoom: 15, max_zoom: 17}, category: 'cat1',
    type: 'marker', marker: {lat: 1, lng: 1}
  },
  route1: {
    id: 'route1', name: 'Test Route A',
    tags: ['a'], alternate_names: ['a'], departments: ['a'], rooms: ['a'],
    gmaps: {min_zoom: 15, max_zoom: 17}, category: 'cat1',
    type: 'route', route: {path: '', offset: 0}
  },
  lot1: {
    id: 'lot1', name: 'Test Parking Lot A',
    tags: ['a'], alternate_names: ['a'], departments: ['a'], rooms: ['a'],
    gmaps: {min_zoom: 15, max_zoom: 17}, category: 'cat1',
    type: 'parking_lot', parking_lot: {layer: [], center: {lat: 2, lng: 2}}
  },
};

ItemStore.getAll = () => items;
ItemStore.getItem = (id) => items[id];
ItemStore.getItemState = (id) => state[id];
ItemStore.hasItem = (id) => typeof items[id] !== undefined;
ItemStore.getMarkers = () => [items.marker1];
ItemStore.getRoutes = () => [items.route1];
ItemStore.getInfoWindow = () => 'marker1';
ItemStore.getSelected = () => 'marker1';
ItemStore.getCategories = () => ['cat1', 'cat2', 'cat3'];
ItemStore.getItemsByCategory = () => {cat1: items};
ItemStore.getActiveCategories = () => 'cat1';
ItemStore.getNumSearchItems = () => 0;
ItemStore.getSearched = () => [];

export default ItemStore;
