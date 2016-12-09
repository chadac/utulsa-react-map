import React, {Component, PropTypes} from 'react';

import FluxComponent from '../../hoc/FluxComponent';

import AppState from '../../constants/AppState';
import SearchResults from './SearchResults';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/MenuBar.scss';
const cx = classnames.bind(styles);

const SUBMENU_HEIGHT = (window.innerHeight
                     || document.documentElement.clientHeight
                     || document.body.clientHeight) * 0.8;

class FilterWidget extends Component {
  render() {
    return (
      <i className={cx("menu-icon", "material-icons", "filter")}>filter_list</i>
    );
  }
}

/**
 * Simple widget that updates when users perform searches.
 */
class SearchWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
    };
  }
  render() {
    return (
      <div className={cx("search-container")}>
        <input type="text" className={cx("search")} placeholder="Search"
               onChange={this._onChange.bind(this)} />
        { this.state.text.length > 0 ?
          <i className={cx("menu-icon", "material-icons", "search-clear")}>clear</i> :
          <i className={cx("menu-icon", "material-icons", "search-glass")}>search</i>
        }
      </div>
    );
  }

  _onChange(event) {
    const text = event.target.value;
    this.setState({text: text});
    if(text.length > 1)
      this.props._search(text);
    if(text.length <= 0)
      this.props._resetSearch();
  }
}

SearchWidget.propTypes = {
  _search: PropTypes.func.isRequired,
  _resetSearch: PropTypes.func.isRequired,
};

class MenuBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={cx('menu-bar', {
          'menu-bar-with-submenu': this.props.appState !== AppState.NORMAL,
        })}>
        <div className={cx('menu-head')}>
          <FilterWidget _setAppState={this.actions().app.setState} />
          
          <SearchWidget _search={this.actions().item.search}
                        _resetSearch={this.actions().item.resetSearch}/>
        </div>
        <div className={cx('menu-content')}>
          {this.renderSubMenu()}
        </div>
      </div>
    );
  }

  renderSubMenu() {
    return (
      <SearchResults height={SUBMENU_HEIGHT}
                     display={this.props.appState === AppState.SEARCH}
                     items={this.props.items} {...this.flux()} />
    );
  }
}

MenuBar.propTypes = {
  map: PropTypes.object.isRequired,
  appState: PropTypes.string.isRequired,

  items: PropTypes.array.isRequired,
};

export default new FluxComponent(MenuBar);
