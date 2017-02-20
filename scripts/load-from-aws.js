const aws = require('aws-sdk');
const fs = require('fs');

if(!fs.existsSync("secret/aws-config.json")) {
  console.err("Could not find AWS credentials file in `secrets/aws-config.json`. Please see http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html for more information.");
  process.exit();
}

aws.config.loadFromPath('./secret/aws-config.json');
const s3 = new aws.S3({apiVersion: '2006-03-01', params: {Bucket: 'utulsa-aws', Prefix: 'assets/maps/places/'}})

class DTracker {
  constructor() {
    this.calls = 0;
    this.data = {};
    this.finished = false;
  }

  add() {
    this.calls++;
  }

  assign(id, content) {
    this.data[id] = content;
    this.calls--;
    if(this.calls <= 0 && this.finished) {
      this._export();
    }
  }

  finish() {
    this.finished = true;
    if(this.calls <= 0) this._export();
  }

  _export() {
    fs.writeFile('src/data/descriptions.json', JSON.stringify(this.data, null, '  '));
  }
}

let response = s3.listObjects({}, (err, data) => {
  let photos = {};
  let descriptions = new DTracker;
  data.Contents.forEach((item) => {
    let match = item.Key.match(/assets\/maps\/places\/([A-Za-z0-9_]+)\/(.+\.([A-Za-z0-9]+))$/);
    if(match == null) return;
    let url = 'https://d3hmp6ymp94s0x.cloudfront.net/' + match[0],
        id = match[1],
        fileName = match[2],
        fileType = match[3];
    if(fileType == "jpg") {
      if(!(id in photos)) photos[id] = [];
      photos[id].push(url);
    }
    else if(fileName == "description.html") {
      descriptions.add();
      s3.getObject({Key: item.Key}, (err, data) => {
        descriptions.assign(id, data.Body.toString());
      });
    }
  });

  fs.writeFile('src/data/photos.json', JSON.stringify(photos, null, '  '));
  descriptions.finish();
});
