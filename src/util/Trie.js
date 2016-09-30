/**
 * Simple trie for searching :)
 **/
class Trie {
  constructor() {
    this._tree = {};
  }

  add(w, item) {
    w = w.toLowerCase();
    this._put(this._tree, w, item);
  }

  _put(tree, w, item) {
    const a = w[0];
    if(tree[a] === undefined) tree[a] = {};
    if(w.length <= 1) {
      if(tree[a]._item === undefined)
        tree[a]._item = [item];
      else
        tree[a]._item.push(item);
    }
    else
      this._put(tree[a], w.slice(1), item);
  }

  search(w) {
    w = w.toLowerCase();
    let tree = this._tree;
    for(var i = 0; i < w.length; i++) {
      if(tree[w[i]] === undefined)
        return [];
      else
        tree = tree[w[i]];
    }
    return this._traverse(tree);
  }

  _traverse(tree) {
    let items = [];
    Object.keys(tree).forEach((key) => {
      if(key == '_item') {
        items = items.concat(tree._item);
      } else {
        items = items.concat(this._traverse(tree[key]));
      }
    });
    return items;
  }
}

module.exports = Trie;
