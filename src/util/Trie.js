/**
 * Simple trie for searching
 *
 * See [[https://en.wikipedia.org/wiki/Trie]] for more information.
 *
 * @module Trie
 **/

/**
 * Trie class that accepts a series of terms and items, which can quickly
 * search the set of all terms and return relevant items.
 *
 * See the unit tests for various samples.
 *
 * @class
 */
class Trie {
  constructor() {
    // The "root node" of the trie
    this._tree = {};
  }

  /**
   * Adds a word-item pair to the trie.
   * @param {string} w - The search term.
   * @param {*} item - The corresponding item.
   */
  add(w, item) {
    w = w.toLowerCase();
    this._put(this._tree, w, item);
  }

  /**
   * Internal recursive method that places the word/item
   * pair into the trie.
   *
   * @param {Object} tree - The root node of the active subtree.
   * @param {string} w - The word (or subword) to add.
   * @param {*} item - The item to add.
   */
  _put(tree, w, item) {
    const a = w[0];
    if(typeof tree[a] === "undefined") tree[a] = {};

    // If we are at the last letter of the word, add a root node to the tree.
    if(w.length <= 1) {
      if(typeof tree[a]._item === "undefined")
        tree[a]._item = [item];
      else
        tree[a]._item.push(item);
    }
    else // Otherwise, recursively add to the subtree
      this._put(tree[a], w.slice(1), item);
  }

  /**
   * Searches for a word inside the trie. This is done by recursively
   * navigating the trie until the end of the word, and then collecting all
   * subtrees.
   * @param {string} w - The word to search.
   * @returns {Array} results - The results of the search.
   */
  search(w) {
    w = w.toLowerCase();
    let tree = this._tree;
    for(var i = 0; i < w.length; i++) {
      if(typeof tree[w[i]] === "undefined")
        return [];
      else
        tree = tree[w[i]];
    }
    return this._traverse(tree);
  }

  /**
   * Private method that recursively collects results from a tree.
   * @param {Object} tree - The subtree to search.
   * @returns {Array} items - The root nodes of the subtree.
   */
  _traverse(tree) {
    let items = [];
    Object.keys(tree).forEach((key) => {
      if(key === '_item') {
        items = items.concat(tree._item);
      } else {
        items = items.concat(this._traverse(tree[key]));
      }
    });
    return items;
  }
}

export default Trie;
