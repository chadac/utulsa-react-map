import React, {Component, PropTypes} from 'react';

import styles from '../../stylesheets/ItemInfoBlock.scss';

class PhotoGallery extends Component {
  render() {
    const photos = this.props.photos.map((url) => (
      <img key={url} src={url} className={styles.photo} />
    ));
    return (
      <div className={styles.photoGallery}>
        {photos}
      </div>
    );
  }
}

PhotoGallery.propTypes = {
  photos: PropTypes.array.isRequired,
};

class ItemInfoBlock extends Component {
  listingBlock(key, name, className) {
    let block = null;
    if(typeof this.props[key] !== "undefined") {
      const items = this.props[key].map((item) => (<li key={item}>{item}</li>));
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
    const alternateNames = this.listingBlock("alternate_names", "Also Called:", styles.alternateNames);
    const departments = this.listingBlock("departments", "Departments & Offices", styles.departments);
    const rooms = this.listingBlock("rooms", "Rooms", styles.rooms);
    return (
      <div>
        <h1 className={styles.header}>{this.props.name}</h1>
        <div className={styles.address}>{this.props.address}</div>
        {alternateNames}
        <p className={styles.description}>{this.props.description}</p>
        <PhotoGallery photos={this.props.photos} />
        {departments}
        {rooms}
      </div>
    );
  }
}

ItemInfoBlock.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string,
  description: PropTypes.string,
  photos: PropTypes.array,
};

export default ItemInfoBlock;
