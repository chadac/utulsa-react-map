import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import Map from './Map'

class App extends Component {
  static defaultProps = {
    center: {lat: 36.15159935580428, lng: -95.94644401639404},
    zoom: 16
  };

  state = {
    props: []
  }

  _fetchPlaces() {
    var setPlaces = function(that) { return function(data) {
      that.setState({places: data.places
                    .map((place) => place.place) // Localist is ridiculous
                    .filter((place) => place.geo.latitude != null &&
                                     place.geo.longitude != null)
        });
    }};
    fetch('http://calendar.utulsa.edu/api/2/places?pp=100')
      .then( function(response) {
        return response.json();
      })
      .then(setPlaces(this))
      .catch( function(err) {
        console.log(err);
        return null;
      });
  }

  componentDidMount() {
    this._fetchPlaces();
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    return (
      <div style={{width:"750px", height:"750px"}}>
        <Map
          places={this.state.places}
        />
      </div>
    );
  }
}

export default App;
