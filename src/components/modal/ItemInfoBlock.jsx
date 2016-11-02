import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import styles from '../../stylesheets/ItemInfoBlock.scss';

const PhotoGallery = React.createClass({
  render() {
    const photos = this.props.photos.map((url) => (
      <img key={url} src={url} className={styles.photo} />
    ));
    return (
      <div className={styles.photoGallery}>
        {photos}
      </div>
    );
  },
});

const ItemInfoBlock = React.createClass({
  listingBlock(key, name, className) {
    let block;
    if(this.props[key] !== undefined) {
      const items = this.props[key].map((item) => (<li>{item}</li>));
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
  },

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
  },
});

module.exports = ItemInfoBlock;
