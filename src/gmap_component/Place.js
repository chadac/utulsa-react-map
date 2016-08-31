import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './Place.scss';

console.log(styles);

class Place extends Component {
  static defaultProps = {
    active: false
  }

  handleKeyDown = (event) => {
    console.log(event);
  }

  render() {
    var infoboxClasses = {};
    const infoboxActive = this.$hover;
    infoboxClasses[styles['infobox']] = true;
    infoboxClasses[styles['infobox-active']] = infoboxActive;
    infoboxClasses[styles['infobox-inactive']] = !infoboxActive;
    return(
      <div>
        <div
            className={classNames(infoboxClasses)}
        >
          <h1>{this.props.place.name}</h1>
          {this.props.place.address}
        </div>
        <img className={styles['icon']}
            role="presentation"
            src="http://utulsa-assets.s3.amazonaws.com/web/static/v1/images/tu_map_icon.png"
        />
      </div>
    );
  }
}

export default Place;
