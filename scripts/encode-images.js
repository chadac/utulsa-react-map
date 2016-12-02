const fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

console.log("Reading images...");
fs.readdir('./data/images', (err, files) => {
  images = {};
  files.forEach(file => {
    images[file.slice(0,-4)] = "data:image/png;base64," + base64_encode("./data/images/" + file);
  });
  fs.writeFile('./src/data/mapIcons.json', JSON.stringify(images, null, '  '));
});
console.log("Done.");
