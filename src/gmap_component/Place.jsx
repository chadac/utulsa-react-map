import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './Place.scss';

console.log(styles);

class Place extends Component {
  static defaultProps = {
    active: false,
  }

  constructor() {
    super()
    this.state = {
      iconHover: false
    };
  }

  handleKeyDown = (event) => {
    console.log(event);
  }

  _onMouseEnter = () => {
    this.setState({iconHover: true});
  }

  _onMouseLeave = () => {
    this.setState({iconHover: false});
  }

  render() {
    return(
      <div className={classNames(styles['Place'])}>
        <div
            className={classNames(styles['infobox'],
                                  this.state.iconHover ? styles['infobox-active'] : styles['infobox-inactive'])}
        >
          <h1>{this.props.place.name}</h1>
          {this.props.place.address}
        </div>
        <div className={classNames(styles['icon'], styles['icon--default'])}
             onMouseEnter={this._onMouseEnter}
             onMouseLeave={this._onMouseLeave}
        />
      </div>
    );
  }
}

export default Place;
