import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/MoreInformation.scss';
const cx = classnames.bind(styles);

class PhotoGallery extends Component {
  render() {
    return null;
  }
}

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
    if(!this.props.item.$selected) return null;

    const alternateNames = this.listingBlock("alternate_names", "Also Called:", cx("alternate-names"));
    const departments = this.listingBlock("departments", "Departments & Offices", cx("departments"));
    const rooms = this.listingBlock("rooms", "Rooms", cx("rooms"));
    const data = this.props.data;
    return (
      <div>
        <h1 className={cx("header")}>{data.name}</h1>
        <div className={cx("address")}>{data.address}</div>
        {alternateNames}
        <p className={cx("description")}>{data.description}</p>
        <PhotoGallery photos={data.photos} />
        {departments}
        {rooms}
      </div>
    );
  }
}

ItemInfo.propTypes = {
  data: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

export default ItemStateHOC(ItemInfo);
