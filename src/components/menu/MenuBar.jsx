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


class MinimizeBlock extends Component {
  render() {
    if(this.props.appState !== AppState.NORMAL) {
      return (
        <div className={cx("menu-minimize")} onClick={this._onClick.bind(this)}>
          <i className="material-icons">
            {this.props.minimized ? "arrow_drop_down" : "arrow_drop_up" }
          </i>
        </div>
      );
    }
    else return null;
  }

  _onClick() {
    if(this.props.minimized) {
      this.props._maximize();
    }
    else {
      this.props._minimize();
    }
  }
}

MinimizeBlock.propTypes = {
  appState: PropTypes.string.isRequired,
  minimized: PropTypes.bool.isRequired,

  _minimize: PropTypes.func.isRequired,
  _maximize: PropTypes.func.isRequired,
};


class MenuBar extends Component {
  constructor(props) {
    super(props);

    this.stores().app.addChangeListener(this._onAppStateChanged.bind(this));

    this.state = {
      minimized: false
    };
  }

  render() {
    return (
      <div>
        <div className={cx('menu-bar')}>
          <div className={cx('menu-head', {
              'submenu': this.props.appState !== AppState.NORMAL && !this.state.minimized
            })}>
            <FilterWidget appState={this.props.appState}
                          _setAppState={this.actions().app.setState} />
            <SearchWidget _search={this.actions().item.search}
                          _resetSearch={this.actions().item.resetSearch}
                          _selectSearched={this.actions().item.selectSearched} />
          </div>
          {this.renderSubMenu()}
        </div>
        <MinimizeBlock appState={this.props.appState} minimized={this.state.minimized}
                       _minimize={this.minimize.bind(this)}
                       _maximize={this.maximize.bind(this)}/>
      </div>
    );
  }

  renderSubMenu() {
    return (
      <div className={cx('menu-content')} style={{display: this.state.minimized ? "none" : ""}}>
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

  _onAppStateChanged() {
    this.maximize();
  }

  minimize() {
    this.setState({minimized: true});
  }

  maximize() {
    this.setState({minimized: false});
  }
}

MenuBar.propTypes = {
  map: PropTypes.object.isRequired,
  appState: PropTypes.string.isRequired,

  items: PropTypes.array.isRequired,
  cats: PropTypes.object.isRequired,
  activeCats: PropTypes.object.isRequired,
};

export default new FluxComponent(MenuBar);
