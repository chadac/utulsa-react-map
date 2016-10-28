/**
 * Smooths a region given as KML coordinates.
 **/

const data = require('../src/data/kml_parking');
const fs = require('fs');

// Minimum error between items
EPSILON = 0.00005;

class Grouping {
  constructor(key) {
    this.key = key;
    this.groups = [];
    this.items = [];
  }

  // Merge group1 into group2
  merge(group1, group2) {
    // Move all items from group1 to group2
    for(let item of group1) {
      group2.push(item);
      item[1] = group2;
    }
    // Remove the old group
    this.groups.splice(this.groups.indexOf(group1), 1);
  }

  mergeAll(groups) {
    groups.sort((group) => -group.length);
    for(let i = groups.length-1; i > 0; i--) {
      this.merge(groups[i], groups[0]);
    }
    return groups[0];
  }

  findAndAdd(item1) {
    let groups = new Set([]);
    for(let [item2, group] of this.items) {
      if(Math.abs(item1[this.key] - item2[this.key]) <= EPSILON) {
        groups.add(group);
      }
    }

    groups = [...groups];
    if(groups.length <= 0) {
      let newGroup = [];
      this.groups.push(newGroup);
      return this.add(newGroup, item1);
    }
    else if(groups.length == 1) {
      let addGroup = groups[0];
      return this.add(addGroup, item1);
    }
    else {
      // need to merge groups
      let addGroup = this.mergeAll(groups);
      return this.add(addGroup, item1);
    }
  }

  add(group, item) {
    let newItem = [item, group];
    this.items.push(newItem);
    group.push(newItem);
    return newItem;
  }

  process(items) {
    // First, group all items
    for(let item of items) {
      this.findAndAdd(item);
    }

    // Remove group tracking from items
    this.groups = this.groups.map((group) =>
      group.map((item) => item[0]));

    // Set all items in each group to use the mean
    for(let group of this.groups) {
      const size = group.length;
      const mean = group
        .map((item) => item[this.key])
        .reduce((a, b) => a + b) / size;
      for(let item of group) {
        item[this.key] = mean;
      }
    }
  }
}

function parseKMLCoords(msg) {
  var msgSplit = msg.split(' ');
  return msgSplit.map((coordStr) => {
    var coords = coordStr.split(',')
    return { lng: Number(coords[0]), lat: Number(coords[1])};
  });
}

function groupItems(newData) {
  let items = [];
  for(let key of Object.keys(newData)) {
    for(let polygon of newData[key]) {
      items = items.concat(polygon);
    }
  }

  latGrouping = new Grouping("lat");
  lngGrouping = new Grouping("lng");

  latGrouping.process(items);
  lngGrouping.process(items);
}

function parseData() {
  newData = {};
  Object.keys(data).forEach((key) => {
    newData[key] = data[key].map((item) => parseKMLCoords(item));
  });
  return newData;
}

newData = parseData();

groupItems(newData);

console.log();

fs.writeFile('src/data/parking_polygons.json', JSON.stringify(newData, null, '  '));
