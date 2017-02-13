/**
 * @module SearchResults
 */
import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';
import FluxComponent from '../../hoc/FluxComponent';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/SearchResults.scss';
const cx = classnames.bind(styles);


/**
 * Represents a singular search item.
 * @class
 */
class SearchItemMain extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * Render step.
   * @returns {ReactElement} searchItem
   */
  render() {
    if(!this.props.item.search.$active) return null;

    let thumbnail = null;
    if(this.props.data.photos) {
      let photo = this.props.data.photos[0];
      thumbnail = (
        <div className={cx("thumbnail")}>
          <img src={photo} />
        </div>
      );
    }
    const data = this.props.data;
    const terms = this.props.item.search.terms;
    return (
      <div className={cx("search-item", {
          "inactive": !this.props.item.filter.$active,
        })} onClick={this._onClick.bind(this)}>
        {thumbnail}
        <div className={cx("content")}>
          <span className={cx("name")}>{data.name}</span>
          { terms.length > 0 ?
            (<span className={cx("terms")}>&nbsp;({terms.join(", ")})</span>)
            : null }
          <hr />
          <span className={cx("address")}>{ data.address }</span>
        </div>
      </div>
    );
  }

  /**
   * Triggers when the search result is clicked. Focuses on the item.
   */
  _onClick() {
    this.props._focus(this.props.data.id);
  }
}

SearchItemMain.propTypes = {
  data: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,

  _focus: PropTypes.func.isRequired,
};

const SearchItem = new ItemStateHOC(SearchItemMain);


/**
 * Listing of all search results.
 * @class
 */
class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.stores().item.addChangeListener(this._updateSearchItems.bind(this));
    this.stores().item.addStateChangeListener(this._stateChanged.bind(this));

    this.state = {
      // Tracks the number of results
      numResults: this.stores().item.getNumSearchItems(),
      // All items mapped into React components
      searchItems: this.createSearchItems(),
    };
  }

  render() {
    return (
      <div key="main"
           style={{maxHeight: this.props.height,
                   display: this.props.display ? "" : "none"}}
           className={cx("search-results")}>
        {this.state.searchItems}
      </div>
    );
  }

  /**
   * This maps all items into React components, including those not actively
   * searched. Sub-items then manage their display. This is done for performance
   * reasons -- it's slightly faster to have each item handle its own render
   * rather than to mass re-render at each step.
   * @returns {Array.<SearchItem>} searchItems
   */
  createSearchItems() {
    const searchItems = this
      .props.items.map((item) => {
        return <SearchItem key={item.id} data={item} id={item.id}
                           _register={this.stores().item.addStateChangeListener.bind(this.stores().item)}
                           _getItemState={this.stores().item.getItemState.bind(this.stores().item)}
                           _focus={this.actions().item.focus}
               />;
      });
    return searchItems;
  }

  /**
   * Updates all search items.
   */
  _updateSearchItems() {
    this.setState({
      searchItems: this.createSearchItems(),
    });
  }

  /**
   * Updates the number of search items when an item's state is changed.
   */
  _stateChanged() {
    this.setState({
      numResults: this.stores().item.getNumSearchItems(),
    });
  }
}

SearchResults.propTypes = {
  // List of items
  items: PropTypes.array.isRequired,

  // Height of submenu
  height: PropTypes.number.isRequired,
  // Whether to display the submenu
  display: PropTypes.bool.isRequired,
};

export default FluxComponent(SearchResults);
