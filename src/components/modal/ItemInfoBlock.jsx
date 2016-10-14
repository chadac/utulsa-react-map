import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
      <div className={styles.background} onClick={this._unfocus}>
        <div tabIndex="1" className={styles.modalWindow} onClick={this._childClick} onKeyDown={this._keyPress}>
          <div className={styles.x} onClick={this._unfocus}>x</div>
          <h1>{this.props.name}</h1>
          <p className={styles.description}>{this.props.description}</p>
          <PhotoGallery photos={this.props.photos} />
        </div>
      </div>
    );
  },

  _unfocus() {
    this.props._unfocus();
  },

  _childClick(e) {
    e.stopPropagation();
  },

  _keyPress(e) {
    if(e.keyCode == 27) this.props._unfocus();
  }
});

module.exports = ItemInfoBlock;
