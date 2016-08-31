import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import GoogleMap from 'google-map-react';

import Place from './gmap_component/Place'

class Map extends Component {
  static defaultProps = {
    center: {lat: 36.15159935580428, lng: -95.94644401639404},
    zoom: 16,
    places: []
  };

  state = {
    activePlace: null
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  _onChange = (center, zoom, bounds, marginBounds) => {
    console.log(center, zoom, bounds, marginBounds);
  };

  _onChildClick = (key, childProps) => {
    this.setState({
      activePlace: key == this.state.activePlace ? null : key
    });
  }

  render() {
    const places = this.props.places
                       .map((place) => (
                         <Place
                             key={place.name}
                             lat={place.geo.latitude}
                             lng={place.geo.longitude}
                             place={place}
                             active={this.state.activePlace == place.name}
                         />
                       ));
    return (
      <div style={{width:"750px", height:"750px"}}>
        <GoogleMap
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
            onChange={this._onChange}
            onChildClick={this._onChildClick}
        >
          {places}
        </GoogleMap>
      </div>
    );
  }
}

export default Map;
