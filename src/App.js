import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import GoogleMap from 'google-map-react';

class App extends Component {
  static defaultProps = {
    center: {lat: 36.1510016, lng: -95.9475169},
    zoom: 17
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    return (
      <div style={{width:"500px", height:"500px"}}>
        <GoogleMap
         defaultCenter={this.props.center}
         defaultZoom={this.props.zoom}
        />
      </div>
    );
  }
}

export default App;
