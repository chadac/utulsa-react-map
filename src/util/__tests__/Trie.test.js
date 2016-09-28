describe('Trie', () => {
  let Trie;

  beforeEach(() => {
    Trie = require('../Trie');
  });

  describe('#add', () => {
    it('adds one item', () => {
      let trie = new Trie();
      trie.add('web', 1);
      expect(trie._tree).toEqual(
        { w: { e: { b: { _item: 1 } } } },
      );
    });
    it('adds multiple items', () => {
      let trie = new Trie();
      trie.add('web', 1);
      trie.add('wet', 2);
      trie.add('all', 3);
      expect(trie._tree).toEqual(
        {
          w: { e: { b: { _item: 1 },
                    t: { _item: 2 } } },
          a: { l: { l: { _item: 3 } } }
        }
      );
    });
  });

  describe('#search', () => {
    if('finds an item', () => {
      let trie = new Trie();
      trie.add("Hello World!", 1);
      trie.add("Goodbye World!", 2);
      trie.add("Hello my friends!", 3);
      expect(trie.search("Hello World!")).toBe([1]);
      expect(trie.search("Goodbye World!")).toBe([2]);
      expect(trie.search("Hello my friends!")).toBe([3]);
    });

    it('searches into the tree', () => {
      let trie = new Trie();
      trie.add("Sample 1", 1);
      trie.add("Sample 2", 2);
      trie.add("Sample 3", 3);
      trie.add("Example 4", 4);
      expect(trie.search("Sample")).toEqual([1,2,3]);
      expect(trie.search("Example")).toEqual([4]);
    });

    it('is case insensitive', () => {
      let trie = new Trie();
      trie.add("HeLlO wOrLd!", 1);
      expect(trie.search("hello WORLD!")).toEqual([1]);
    });
  });
});
