/**
 * @module MenuBar
 */
import React, {Component, PropTypes} from 'react';

import FluxComponent from '../../hoc/FluxComponent';

import AppState from '../../constants/AppState';
import SearchResults from './SearchResults';
import MoreInformation from './MoreInformation';
import Filter from './Filter';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/MenuBar.scss';
const cx = classnames.bind(styles);

/**
 * Widget that has a button for filtering.
 * @class
 */
class FilterWidget extends Component {
  /**
   * Render method.
   * @returns {ReactComponent} filterWidget
   */
  render() {
    // TODO: Track when the button is hovered/active
    // let active = this.props.appState === AppState.FILTER;
    return (
      <i className={cx("menu-icon", "material-icons", "filter", {"active": this.props.appState === AppState.FILTER})}
         onClick={this._onClick.bind(this)}>
        filter_list
      </i>
    );
  }

  /**
   * Toggles app state between filter and normal.
   */
  _onClick() {
    if(this.props.appState === AppState.FILTER)
      this.props._setAppState(AppState.NORMAL);
    else
      this.props._setAppState(AppState.FILTER);
  }
}

FilterWidget.propTypes = {
  // App state
  appState: PropTypes.string.isRequired,
  // Sets the app state in the App Store
  _setAppState: PropTypes.func.isRequired,
};


/**
 * Simple widget that updates when users perform searches.
 * @class
 */
class SearchWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
    };
  }

  /**
   * Render step.
   * @returns {ReactElement} searchWidget
   */
  render() {
    return (
      <div className={cx("search-container")} style={{width: this.props.width - 48}}>
        <input type="text" className={cx("search")} style={{width: this.props.width - 108}}
               ref="search" placeholder="Search"
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

  /**
   * Triggered when the user clicks on the search icon. Focuses the cursor on
   * the search box so that the user can start typing.
   */
  _search() {
    this.refs.search.focus();
  }

  /**
   * Clears the search box. Happens when the user clicks the "X" next to the
   * search box.
   */
  _clear() {
    this.refs.search.value = "";
    this._onChange();
  }

  /**
   * Triggered on any change of the search box. Propagates changes into the Item
   * Store.
   */
  _onChange() {
    const text = this.refs.search.value;
    this.setState({text: text});
    if(text.length > 1)
      this.props._search(text);
    if(text.length <= 0)
      this.props._resetSearch();
  }

  /**
   * Triggered on key press inside the search box. Currently, it's behavior is
   * to select the searched item in the box if there is only one item.
   * @param {Event} e The keypress event.
   */
  _onKeyPress(e) {
    if(e.key === 'Enter' && this.props._selectSearched()) {
      this._clear();
      this.refs.search.blur();
    }
  }

  /**
   * Triggered on key down inside the search box. This is more general than the
   * keypress event, or less general, I forget.
   *
   * Resets the search box when the user presses `Escape'.
   * @param {Event} e The key-down event.
   */
  _onKeyDown(e) {
    if(e.key === 'Escape') {
      this._clear();
    }
  }
}

SearchWidget.propTypes = {
  width: PropTypes.number.isRequired,

  // Propagates search to the Item Store.
  _search: PropTypes.func.isRequired,
  // Resets search inside the Item Store.
  _resetSearch: PropTypes.func.isRequired,
  // Selects the sole searched item in the Item Store.
  _selectSearched: PropTypes.func.isRequired,
};


/**
 * Small block that appears below the menu block, minimizing anything that is
 * actively shown below. (Resets when the drop-down changes)
 * @class
 */
class MinimizeBlock extends Component {
  /**
   * Render step.
   * @returns {ReactElement} minimizeBlock
   */
  render() {
    if(this.props.appState !== AppState.NORMAL) {
      return (
        <div className={cx("menu-minimize")} style={{width: this.props.width}}
             onClick={this._onClick.bind(this)}>
          <i className="material-icons">
            {this.props.minimized ? "arrow_drop_down" : "arrow_drop_up" }
          </i>
        </div>
      );
    }
    else return null;
  }

  /**
   * Minimizes or maximizes the drop-down.
   */
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
  // App state
  appState: PropTypes.string.isRequired,
  // If this block is minimized.
  minimized: PropTypes.bool.isRequired,
  // The top container's width
  width: PropTypes.number.isRequired,

  // Function to minimize (see MenuBar.minimize())
  _minimize: PropTypes.func.isRequired,
  // Function to maximize (see MenuBar.maximize())
  _maximize: PropTypes.func.isRequired,
};


/**
 * The menu bar that appears on the map. General container for all menu controls.
 * @class
 */
class MenuBar extends Component {
  constructor(props) {
    super(props);

    this.stores().app.addChangeListener(this._onAppStateChanged.bind(this));

    this.state = {
      // If the drop-down is minimized. Tracks state here rather than in
      // MinimizeBlock since we use the value to show/hide the drop-down.
      minimized: false
    };

    this.width = 320;
  }

  /**
   * Render step.
   * @returns {ReactElement} menuBar
   */
  render() {
    this.updateDims();
    return (
      <div>
        <div className={cx('menu-bar')} style={{width: this.width, minWidth: this.width}}>
          <div className={cx('menu-head', {
              'submenu': this.props.appState !== AppState.NORMAL && !this.state.minimized
            })}>
            <FilterWidget appState={this.props.appState}
                          _setAppState={this.actions().app.setState} />
            <SearchWidget _search={this.actions().item.search} width={this.width}
                          _resetSearch={this.actions().item.resetSearch}
                          _selectSearched={this.actions().item.selectSearched} />
          </div>
          {this.renderSubMenu()}
        </div>
        <MinimizeBlock appState={this.props.appState} minimized={this.state.minimized}
                       width={this.width}
                       _minimize={this.minimize.bind(this)}
                       _maximize={this.maximize.bind(this)}/>
      </div>
    );
  }

  /**
   * Recomputes the component's dimensions.
   */
  updateDims() {
    let width = this.props.dims.width;
    if(width > 338) width = 338;
    if(width < 250) width = 250;
    this.width = width - 20;
  }

  /**
   * Renders the drop-down that needs to be shown. For performance reasons, all
   * sub-menus are generated and then conditionally displayed.
   * @returns {ReactElement} subMenu
   */
  renderSubMenu() {
    let submenu_height = this.props.dims.height * 0.8;
    return (
      <div className={cx('menu-content')} style={{display: this.state.minimized ? "none" : ""}}>
        <SearchResults
            height={submenu_height}
            display={this.props.appState === AppState.SEARCH}
            items={this.props.items} {...this.flux()} />
        <MoreInformation
            height={submenu_height}
            display={this.props.appState === AppState.SELECT}
            items={this.props.items} {...this.flux()} />
        <Filter
            height={submenu_height}
            display={this.props.appState === AppState.FILTER}
            cats={this.props.cats} activeCats={this.props.activeCats}
            _addCategory={this.actions().item.addCategory}
            _remCategory={this.actions().item.remCategory}
            {...this.flux()} />
      </div>
    );
  }

  /**
   * Triggers on app state change. Maximizes the drop-down.
   */
  _onAppStateChanged() {
    this.maximize();
  }

  /**
   * Minimizes the drop-down.
   */
  minimize() {
    this.setState({minimized: true});
  }

  /**
   * Maximizes the drop-down.
   */
  maximize() {
    this.setState({minimized: false});
  }
}

MenuBar.propTypes = {
  // Map object
  map: PropTypes.object.isRequired,
  // Dimensions
  dims: PropTypes.object.isRequired,
  // App state
  appState: PropTypes.string.isRequired,

  // Array of items
  items: PropTypes.array.isRequired,
  // Array of categories
  cats: PropTypes.object.isRequired,
  // Array of active categories
  activeCats: PropTypes.object.isRequired,
};

export default new FluxComponent(MenuBar);
