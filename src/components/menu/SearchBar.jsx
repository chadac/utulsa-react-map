import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import FluxComponent from '../../hoc/FluxComponent';

import styles from '../../stylesheets/SearchBar.scss';

class IndexButton extends Component {
  render() {
    var style = {};
    style[styles.selected] = this.props.selected;
    return(
      <div className={classnames(styles.index, style)}
           onClick={this.props._openIndex}>
        <div className={classnames(styles.indexIcon)} />
        <div className={classnames(styles.indexIcon)} />
        <div className={classnames(styles.indexIcon)} />
      </div>
    );
  }
}

IndexButton.propTypes = {
  selected: PropTypes.bool.isRequired,
};

class SearchBar extends Component {
  render() {
    return (
      <div className={classnames(styles.container)}>
        <div className={classnames(styles.searchBar)}>
          <IndexButton selected={this.props.inIndexModal}
                       {...this.flux()} />
          <input className={classnames(styles.searchBox)} type="text"
                 placeholder="Search ..."
                 onChange={this._onChange.bind(this)} />
        </div>
      </div>
    );
  }

  _onChange(event) {
    this.actions().item.search(event.target.value);
  }
}

SearchBar.propTypes = {
  inIndexModal: PropTypes.bool.isRequired,
};

module.exports = FluxComponent(SearchBar);
