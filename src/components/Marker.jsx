import React, {Component} from 'react';
import classNames from 'classnames';
import styles from '../stylesheets/Marker.scss';

class Marker extends Component {
  static defaultProps = {
    active: false,
  }

  constructor() {
    super()
    this.state = {
      iconHover: false
    };
  }

  onComponentMount() {
    this.marker = createMarker();
    this.marker.addListener("click", this.onClick)
    this.marker.addListener("moveover", this.onHover)
  }

  createMarker() {
    return new google.maps.Marker({
      position: this.props.position,
      map: this.props.map
    });
  }

  render() {
    return(
      <div className={classNames(styles.Marker)}>
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

export default Marker;
