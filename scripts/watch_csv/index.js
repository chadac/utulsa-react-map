const fs = require('fs'),
      chokidar = require('chokidar'),
      Converter = require('csvtojson').Converter;

var watcher = chokidar.watch('./src/data/*.csv', {
  persistent: true
});

function convertCSV(path) {
  var jsonPath = path.slice(0, -4) + '.json';
  var converter = new Converter();
  converter.on("end_parsed", (data) => {
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
