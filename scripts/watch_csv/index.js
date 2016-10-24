const fs = require('fs'),
      chokidar = require('chokidar'),
      Converter = require('csvtojson').Converter;

var watcher = chokidar.watch('./src/data/*.csv', {
  persistent: true
});

function filterArray(a) {
  const n = a.length;
  var allNull = true;
  for(var i = n-1; i >= 0; i--) {
    if(a[i] == "" || a[i] == null) a.splice(i, 1);
    else if(a[i] instanceof Array) {
      var result = filterArray(a[i]);
      if(result == null) delete a[i];
      else {
        allNull = false;
        a[key] = result;
      }
    }
    else if(a[i] instanceof Object) {
      var result = filterDict(a[i]);
      if(result == null) delete a[i];
      else {
        allNull = false;
        a[key] = result;
      }
    }
    else {
      allNull = false;
    }
  }
  return allNull ? null : a;
}

function filterDict(d) {
  keys = Object.keys(d);
  var allNull = true;
  keys.forEach((key) => {
    if(d[key] == "")
      delete d[key];
    else if(d[key] instanceof Array) {
      var result = filterArray(d[key]);
      if(result == null) delete d[key];
      else {
        allNull = false;
        d[key] = result;
      }
    }
    else if(d[key] instanceof Object) {
      var result = filterDict(d[key]);
      if(result == null) delete d[key];
      else {
        allNull = false;
        d[key] = result;
      }
    }
    else {
      allNull = false;
    }
  });
  return allNull ? null : d;
}

function convertCSV(path) {
  var jsonPath = path.slice(0, -4) + '.json';
  var converter = new Converter();
  converter.on("end_parsed", (data) => {
    data = filterDict(data);
    fs.writeFile(jsonPath, JSON.stringify(data));
  });
  fs.createReadStream(path).pipe(converter);
}

watcher.on('change', (path) => {
  convertCSV(path);
  console.log('Updated `' + path + '`.');
});

watcher.on('add', (path) => {
  convertCSV(path);
  console.log('Added `' + path + '`.');
});
