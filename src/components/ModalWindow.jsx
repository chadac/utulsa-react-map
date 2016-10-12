import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import styles from '../stylesheets/ModalWindow.scss';

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

const ItemModalWindow = React.createClass({
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

const ModalWindow = React.createClass({
  render() {
    let item = null;
    if(this.props.item != null) {
      item = (<ItemModalWindow key={this.props.item.id} _unfocus={this.props._unfocus} {...this.props.item} />);
    }
    return (
      <ReactCSSTransitionGroup
          transitionName={{
            enter: styles.enter,
            enterActive: styles.enterActive,
            leave: styles.leave,
            leaveActive: styles.leaveActive,
          }}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
      >
        {item}
      </ReactCSSTransitionGroup>
    );
  },
});

module.exports = ModalWindow;
