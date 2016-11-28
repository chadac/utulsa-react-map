import React, {Component, PropTypes} from 'react';

import MapControl from './MapControl';
import gmaps from '../../GMapsAPI';
import controlStyles from '../../stylesheets/MapControl.scss';


class CategoryBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false,
    };
  }

  render() {
    const optionStyles = {
      backgroundColor: this.state.hover ? "rgb(235,235,235)" : "rgb(255,255,255)",
    };
    const checkboxStyles = {
      display: this.props.selected || this.state.hover ? "" : "none",
      opacity: this.state.hover && !this.props.selected ? "0.5" : "",
    };
    return (
      <div className={controlStyles.controlOption} style={optionStyles}
           onClick={this._onCheck}
           onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
        <span role="checkbox" className={controlStyles.controlCheckbox}>
          <div className={controlStyles.controlCheckboxDiv} style={checkboxStyles}>
            <img className={controlStyles.controlCheckboxImg}
                 src="https://maps.gstatic.com/mapfiles/mv/imgs8.png" />
          </div>
        </span>
        <label className={controlStyles.controlOptionLabel}>
          {this.props.category}
        </label>
      </div>
    );
  }

  _onCheck() {
    if(this.props.category === "SELECT ALL") {
      if(!this.props.selected) {
        this.props.categories.forEach((category) => {
          this.props._addCategory(category);
        });
      }
      else {
        this.props.categories.forEach((category) => {
          this.props._remCategory(category);
        });
      }
    }
    else {
      if(!this.props.selected) {
        this.props._addCategory(this.props.category);
      } else {
        this.props._remCategory(this.props.category);
      }
    }
  }

  _onMouseEnter() {
    this.setState({hover: true});
  }

  _onMouseLeave() {
    this.setState({hover: false});
  }
}

CategoryBox.propTypes = {
  selected: PropTypes.bool.isRequired,
  category: PropTypes.string.isRequired,
  categories: PropTypes.arrray.isRequired,

  _addCategory: PropTypes.func.isRequired,
  _remCategory: PropTypes.func.isRequired,
};


class FilterMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false,
      hoverDelay: false,
      titleHover: false,
    };
  }

  render() {
    let checkboxes = this.props.categories.map((category) => (
      <CategoryBox key={category} category={category}
                   selected={this.props.activeCategories.indexOf(category) >= 0}
                   _addCategory={this.props._addCategory}
                   _remCategory={this.props._remCategory} />
    ));
    const selectAllSelected = this.props.activeCategories.length === this.props.categories.length;
    const selectAllCheckbox = (
      <CategoryBox key="SELECT ALL" category="SELECT ALL"
                   categories={this.props.categories}
                   selected={selectAllSelected}
                   _addCategory={this.props._addCategory}
                   _remCategory={this.props._remCategory} />
    );
    checkboxes.unshift(selectAllCheckbox);

    const titleStyles = {
      backgroundColor: !this.state.titleHover ? "rgb(255, 255, 255)" : "rgb(235,235,235)",
    };
    const optionStyles = {
      display: this.state.hoverDelay ? "block" : "none",
    };
    return (
      <MapControl id="filter_by" map={this.props.map}
                  position={gmaps.ControlPosition.LEFT_TOP}>
        <div onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
          <div className={controlStyles.controlTitle} style={titleStyles}
               onClick={this._onClick}
               onMouseEnter={this._onMouseEnterTitle} onMouseLeave={this._onMouseLeaveTitle}>
            Filter by...
          </div>
          <div className={controlStyles.controlOptions} style={optionStyles}>
            {checkboxes}
          </div>
        </div>
      </MapControl>
    );
  }

  _onMouseEnter() {
    this.setState({hover: true, hoverDelay: true});
  }

  _onMouseLeave() {
    this.setState({hover: false})
    setTimeout(() => {
      if(!this.state.hover)
        this.setState({hoverDelay: false})
    }, 1000);
  }

  _onMouseEnterTitle() {
    this.setState({titleHover: true});
  }

  _onMouseLeaveTitle() {
    this.setState({titleHover: false});
  }
}

FilterMenu.propTypes = {
  map: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  activeCategories: PropTypes.array.isRequired,

  _addCategory: PropTypes.func.isRequired,
  _remCategory: PropTypes.func.isRequired,
};

module.exports = FilterMenu;
