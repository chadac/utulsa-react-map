import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import FluxComponent from '../../hoc/FluxComponent';

import styles from '../../stylesheets/ModalWindow.scss';

class ModalWindow extends Component {
  render() {
    let child = null;
    if(this.props.children !== null) {
      child = (
        <div tabIndex="1" className={styles.modalWindow}
             onClick={this._closeModal.bind(this)} onKeyDown={this._keyPress.bind(this)}>
          <div className={styles.content} onClick={this._childClick.bind(this)}>
            <div className={styles.x} onClick={this._closeModal.bind(this)}>x</div>
            {this.props.children}
          </div>
        </div>
      );
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
        {child}
      </ReactCSSTransitionGroup>
    );
  }

  _closeModal() {
    this.actions().appState.closeModal();
  }

  _childClick(e) {
    e.stopPropagation();
  }

  _keyPress(e) {
    if(e.keyCode === 27) this._closeModal();
  }
}

ModalWindow.propTypes = {};

export default FluxComponent(ModalWindow);
