import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import FluxComponent from '../../hoc/FluxComponent';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/SearchResults.scss';
const cx = classnames.bind(styles);


class SearchItemMain extends Component {

  constructor(props) {
    super(props);

    this.state = {
      $active: false,
    };
  }

  render() {
    if(!this.props.item.search.$active) return null;

    const data = this.props.data;
    const terms = this.props.item.search.terms;
    return (
      <div className={cx("search-item")}>
        {data.name}
        <span className={cx("terms")}>{terms.join(", ")}</span>
      </div>
    );
  }
}

SearchItemMain.propTypes = {
  data: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

const SearchItem = new ItemStateHOC(SearchItemMain);


class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.stores().item.addStateChangeListener(this._stateChanged.bind(this));

    this.state = {
      numResults: this.stores().item.getNumSearchItems(),
    };
  }

  render() {
    const searchItems = this.createSearchItems();
    return (
      <div key="main"
           style={{height: this.props.height,
                   display: this.props.display ? "" : "none"}}
           className={cx("search-results")}>
        {searchItems}
      </div>
    );
  }

  createSearchItems() {
    const searchItems = this
      .props.items.map((item) => {
        return <SearchItem key={item.id} data={item} id={item.id}
                           _register={this.stores().item.addStateChangeListener.bind(this.stores().item)}
                           _getItemState={this.stores().item.getItemState.bind(this.stores().item)}
               />;
      });
    return searchItems;
  }

  _stateChanged() {
    this.setState({
      numResults: this.stores().item.getNumSearchItems(),
    });
  }
}

SearchResults.propTypes = {
  items: PropTypes.array.isRequired,

  height: PropTypes.number.isRequired,
  display: PropTypes.bool.isRequired,
};

export default FluxComponent(SearchResults);
