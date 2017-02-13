const aws = require('aws-sdk');
const fs = require('fs');

if(!fs.existsSync("secret/aws-config.json")) {
  console.err("Could not find AWS credentials file in `secrets/aws-config.json`. Please see http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html for more information.");
  process.exit();
}

aws.config.loadFromPath('./secret/aws-config.json');
const s3 = new aws.S3({apiVersion: '2006-03-01', params: {Bucket: 'utulsa-aws', Prefix: 'assets/maps/places/'}})

let response = s3.listObjects({}, (err, data) => {
  let photos = {};
  data.Contents.forEach((item) => {
    let match = item.Key.match(/assets\/maps\/places\/([A-Za-z0-9_]+)\/.+\.jpg$/);
    if(match == null) return;
    let photo = 'https://utulsa-aws.s3.amazonaws.com/' + match[0],
        id = match[1];
    if(!(id in photos)) photos[id] = [];
    photos[id].push(photo);
  });
  fs.writeFile('src/data/photos.json', JSON.stringify(photos, null, '  '));
});
