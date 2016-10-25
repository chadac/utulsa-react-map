/**
 * Groups items by a unique key.
 **/
function groupBy(items, key) {
  // get categories
  var c = {};
  items.forEach((item) => {
    if(c[item[key]] == undefined)
      c[item[key]] = [item]
    else
      c[item[key]].push(item);
  });
  return c;
}

module.exports = {
  groupBy: groupBy,
};
