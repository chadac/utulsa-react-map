import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';
import FluxComponent from '../../hoc/FluxComponent';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/SearchResults.scss';
const cx = classnames.bind(styles);


class SearchItemMain extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if(!this.props.item.search.$active) return null;

    const data = this.props.data;
    const terms = this.props.item.search.terms;
    return (
      <div className={cx("search-item", {
          "inactive": !this.props.item.filter.$active,
        })} onClick={this._onClick.bind(this)}>
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

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.stores().item.addStateChangeListener(this._stateChanged.bind(this));

    this.state = {
      numResults: this.stores().item.getNumSearchItems(),
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

  _updateSearchItems() {
    this.setState({
      searchItems: this.createSearchItems(),
    });
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
