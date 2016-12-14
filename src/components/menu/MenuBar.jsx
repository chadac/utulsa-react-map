import React, {Component, PropTypes} from 'react';

import FluxComponent from '../../hoc/FluxComponent';

import AppState from '../../constants/AppState';
import SearchResults from './SearchResults';
import MoreInformation from './MoreInformation';
import Filter from './Filter';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/MenuBar.scss';
const cx = classnames.bind(styles);

const SUBMENU_HEIGHT = (window.innerHeight
                     || document.documentElement.clientHeight
                     || document.body.clientHeight) * 0.8;

class FilterWidget extends Component {
  render() {
    return (
      <i className={cx("menu-icon", "material-icons", "filter")}
         onClick={this._onClick.bind(this)}>
        filter_list
      </i>
    );
  }

  _onClick() {
    if(this.props.appState === AppState.FILTER)
      this.props._setAppState(AppState.NORMAL);
    else
      this.props._setAppState(AppState.FILTER);
  }
}

FilterWidget.propTypes = {
  appState: PropTypes.string.isRequired,
  _setAppState: PropTypes.func.isRequired,
};

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
        <input type="text" className={cx("search")} ref="search" placeholder="Search"
               onChange={this._onChange.bind(this)}
               onKeyPress={this._onKeyPress.bind(this)}
               onKeyDown={this._onKeyDown.bind(this)}
        />
        { this.state.text.length > 0 ?
        <i className={cx("menu-icon", "material-icons", "search-clear")}
           onClick={this._clear.bind(this)}>
          clear
        </i> :
          <i className={cx("menu-icon", "material-icons", "search-glass")}
             onClick={this._search.bind(this)}>
            search
          </i>
        }
      </div>
    );
  }

  _search() {
    this.refs.search.focus();
  }

  _clear() {
    this.refs.search.value = "";
    this._onChange();
  }

  _onChange() {
    const text = this.refs.search.value;
    this.setState({text: text});
    if(text.length > 1)
      this.props._search(text);
    if(text.length <= 0)
      this.props._resetSearch();
  }

  _onKeyPress(e) {
    if(e.key === 'Enter' && this.props._selectSearched()) {
      this._clear();
      this.refs.search.blur();
    }
  }

  _onKeyDown(e) {
    if(e.key === 'Escape') {
      this._clear();
    }
  }
}

SearchWidget.propTypes = {
  _search: PropTypes.func.isRequired,
  _resetSearch: PropTypes.func.isRequired,
  _selectSearched: PropTypes.func.isRequired,
};

class MenuBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={cx('menu-bar')}>
        <div className={cx('menu-head', {
            'submenu': this.props.appState !== AppState.NORMAL
          })}>
          <FilterWidget appState={this.props.appState}
                        _setAppState={this.actions().app.setState} />
          <SearchWidget _search={this.actions().item.search}
                        _resetSearch={this.actions().item.resetSearch}
                        _selectSearched={this.actions().item.selectSearched} />
        </div>
        <div className={cx('menu-content')}>
          {this.renderSubMenu()}
        </div>
      </div>
    );
  }

  renderSubMenu() {
    return (
      <div>
        <SearchResults
            height={SUBMENU_HEIGHT}
            display={this.props.appState === AppState.SEARCH}
            items={this.props.items} {...this.flux()} />
        <MoreInformation
            height={SUBMENU_HEIGHT}
            display={this.props.appState === AppState.SELECT}
            items={this.props.items} {...this.flux()} />
        <Filter
            height={SUBMENU_HEIGHT}
            display={this.props.appState === AppState.FILTER}
            cats={this.props.cats} activeCats={this.props.activeCats}
            _addCategory={this.actions().item.addCategory}
            _remCategory={this.actions().item.remCategory}
            {...this.flux()} />
      </div>
    );
  }
}

MenuBar.propTypes = {
  map: PropTypes.object.isRequired,
  appState: PropTypes.string.isRequired,

  items: PropTypes.array.isRequired,
  cats: PropTypes.array.isRequired,
  activeCats: PropTypes.array.isRequired,
};

export default new FluxComponent(MenuBar);
