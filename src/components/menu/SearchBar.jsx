import React, {Component, PropTypes} from 'react';

import FluxComponent from '../../hoc/FluxComponent';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/SearchBar.scss';
const cx = classnames.bind(styles);

class IndexButton extends Component {
  render() {
    return(
      <div className={cx("index", {"selected": this.props.selected})}
           onClick={this.props._openIndex}>
        <div className={cx("index-icon")} />
        <div className={cx("index-icon")} />
        <div className={cx("index-icon")} />
      </div>
    );
  }
}

IndexButton.propTypes = {
  _openIndex: PropTypes.func.isRequired,

  selected: PropTypes.bool.isRequired,
};

class SearchBar extends Component {
  render() {
    return (
      <div className={cx("container")}>
        <div className={cx("search-bar")}>
          <IndexButton selected={this.props.inIndexModal}
                       _openIndex={this.actions().appState.openIndex} />
          <input className={cx("search-box")} type="text"
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
