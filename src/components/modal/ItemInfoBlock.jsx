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
  render() {
    return (
      <div>
        <h1>{this.props.name}</h1>
        <p className={styles.description}>{this.props.description}</p>
        <PhotoGallery photos={this.props.photos} />
      </div>
    );
  },
});

module.exports = ItemInfoBlock;
