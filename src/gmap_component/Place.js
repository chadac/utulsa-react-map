import React, {Component} from 'react';


class Place extends Component {
  static defaultProps = {
    active: false
  }

  handleKeyDown = (event) => {
    console.log(event);
  }

  render() {
    return(
      <div>
        <img
            role="presentation"
            src="http://utulsa-assets.s3.amazonaws.com/web/static/v1/images/tu_map_icon.png"
        />
      </div>
    );
  }
}

export default Place;
