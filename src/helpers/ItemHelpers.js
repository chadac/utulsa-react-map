/**
 * Groups items by a unique key.
 *
 * @param {object} items The list of items.
 * @param {string} key The key to group by.
 *
 * @return {object} Map where keys are the groups and values are the list of items for each group.
 **/
function groupBy(items, key) {
  // get categories
  var c = {};
  items.forEach((item) => {
    if(typeof c[item[key]] === "undefined")
      c[item[key]] = [item]
    else
      c[item[key]].push(item);
  });
  return c;
}

module.exports = {
  groupBy: groupBy,
};
