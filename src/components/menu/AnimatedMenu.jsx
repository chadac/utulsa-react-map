import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import styles from '../../stylesheets/AnimatedMenu.scss';

class AnimatedMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rendered: false
    };
  }

  componentDidMount() {
    this.setState({rendered: true});
  }

  render() {
    return (
      <ReactCSSTransitionGroup
          transitionName={{
            enter: styles.enter,
            enterActive: styles.enterActive,
            leave: styles.leave,
            leaveActive: styles.leaveActive
          }}
          transitionEnterTimeout={600}
          transitionLeaveTimeout={600}>
        {this.state.rendered ? this.props.children : null}
      </ReactCSSTransitionGroup>
    );
  }
}

export default AnimatedMenu;
