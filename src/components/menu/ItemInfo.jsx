/**
 * @module ItemInfo
 */
import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/MoreInformation.scss';
const cx = classnames.bind(styles);

/**
 * A photo gallery for images of the item.
 * TODO: Implement the gallery class.
 * @class
 */
class PhotoGallery extends Component {
  render() {
    return null;
  }
}

PhotoGallery.propTypes = {};


/**
 * Displays information about the item. This will eventually grow to be very
 * complex, so I've got it stored here.
 * @class
 */
class ItemInfo extends Component {
  listingBlock(key, name, className) {
    let block = null;
    if(typeof this.props.data[key] !== "undefined") {
      const items = this.props.data[key].map((item) => (<li key={item}>{item}</li>));
      block = (
        <div className={className}>
          <h4>{name}</h4>
          <ul>
            {items}
          </ul>
        </div>
      );
    }
    return block;
  }

  render() {
    // Don't show it if it isn't selected
    // We do this from here rather than the parent element for performance.
    if(!this.props.item.$selected) return null;

    // Directions
    const loc = typeof this.props.data.directions !== "undefined" ?
                this.props.data.directions :
                [this.props.data.marker.lat, this.props.data.marker.lng].join(',');
    const directionsUrl = "https://www.google.com/maps/dir//'" + loc + "'/@" + loc + ",17z";

    // Listings
    const alternateNames = this.listingBlock("alternate_names", "Also Called:", cx("alternate-names"));
    const departments = this.listingBlock("departments", "Departments & Offices", cx("departments"));
    const rooms = this.listingBlock("rooms", "Rooms", cx("rooms"));
    const data = this.props.data;
    return (
      <div>
        <h1 className={cx("header")}>{data.name}</h1>
        <div className={cx("exit", "material-icons")} onClick={this.close.bind(this)}>clear</div>
        <div className={cx("address")}>{data.address} (<a target="_blank" href={directionsUrl}>Directions</a>)</div>
        {alternateNames}
        {/* Setting inner HTML allows for styling the description */}
        <p className={cx("description")}
           dangerouslySetInnerHTML={{__html: data.description}}></p>
        <PhotoGallery photos={data.photos} />
        {departments}
        {rooms}
      </div>
    );
  }

  close() {
    this.props._deselect();
  }
}

ItemInfo.propTypes = {
  // Item state
  item: PropTypes.object.isRequired,
  // Item data
  data: PropTypes.object.isRequired,

  _deselect: PropTypes.func.isRequired,
};


export default ItemStateHOC(ItemInfo);
