/**
 * @module MenuBar
 */
import React, {Component, PropTypes} from 'react';

import FluxComponent from '../../hoc/FluxComponent';

import AppState from '../../constants/AppState';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/ShareLink.scss';
const cx = classnames.bind(styles);

function makeQuery(data) {
  let query = Object
    .keys(data)
    .filter((key) => data[key])
    .map((key) => {
      let value = data[key];
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    });
  return query.join('&');
}

class ShareLink extends Component {
  constructor(props) {
    super(props);

    this.callbacks = {};
    this.callbacks.update = this._update.bind(this);
    this.stores().item.addCategoryChangeListener(this.callbacks.update);
    this.stores().item.addSelectListener(this.callbacks.update);
    this.stores().gmaps.addZoomListener(this.callbacks.update);
    this.stores().gmaps.addCenterListener(this.callbacks.update);

    this.state = this._getState();
  }

  componentDidMount() {
    this.setState(this._getState());
  }

  componentWillUnmount() {
    this.stores().item.remCategoryChangeListener(this.callbacks.update);
    this.stores().item.remSelectListener(this.callbacks.update);
    this.stores().gmaps.remZoomListener(this.callbacks.update);
    this.stores().gmaps.remCenterListener(this.callbacks.update);
  }

  render() {
    return (
      <div style={{width: this.props.width, minWidth: this.props.width}}
           className={cx("share-link")} onClick={this._onClick.bind(this)}>
        <input type="text" style={{width: this.props.width - 14}} ref="link"
               value={this._makeLink()} readOnly />
      </div>
    );
  }

  _makeLink() {
    let path = window.location.protocol + "//" + window.location.host + window.location.pathname;
    path += "?" + makeQuery(this.state);
    return path;
  }

  _update() {
    this.setState(this._getState());
  }

  _getState() {
    let center = this.stores().gmaps.getCenter();
    let categories = Object.keys(this.stores().item.getCategories());
    return {
      zoom: this.stores().gmaps.getZoom(),
      center: [center.lat, center.lng].join(','),
      select: this.stores().app.getState() === AppState.SELECT ? this.stores().item.getSelected() : null,
      filter: Array.from(this.stores().item.getActiveCategories())
                   .map((category) => categories.indexOf(category))
                   .join('!')
    }
  }

  _onClick() {
    this.refs.link.select();
  }
}

ShareLink.propTypes = {
  width: PropTypes.number.isRequired,
}


export default FluxComponent(ShareLink);
