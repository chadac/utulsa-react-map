import React, {Component} from 'react';
import MarkerStore from '../stores/MarkerStore';
import MarkerActions from '../actions/MarkerActions';
import classNames from 'classnames';
import styles from '../stylesheets/Marker.scss';

// From http://stackoverflow.com/q/373157
function partial(func /*, 0..n args */) {
  var args = Array.prototype.slice.call(arguments).splice(1);
  return function() {
    var allArguments = args.concat(Array.prototype.slice.call(arguments));
    return func.apply(this, allArguments);
  };
}

const Marker = React.createClass({
  getInitialState() {
    return {};
  },

  componentDidMount() {
    var key = this.props.id;
    this.marker = this.createMarker();
    this.marker.addListener("click", partial(MarkerActions.click, key));
    this.marker.addListener("mouseover", partial(MarkerActions.mouseEnter, key));
    this.marker.addListener("mouseout", partial(MarkerActions.mouseLeave, key));

    this.info = this.createInfoWindow();
  },

  componentWillUnmount() {
    this.marker.setMap(null);
  },

  latlng() {
    return new google.maps.LatLng(
      this.props.position.lat,
      this.props.position.lng
    );
  },

  createMarker() {
    return new google.maps.Marker({
      position: this.latlng(),
      icon: "http://utulsa-assets.s3.amazonaws.com/web/static/v1/images/tu_map_icon.png",
      draggable: true,
      labelContent: this.props.name,
      labelStyle: {opacity: 0.75},
      map: this.props.map,
    });
  },

  createInfoWindow() {
    var content = "<h4>" + this.props.name + "</h4>"
                + "<p>" + this.props.address + "</p>"
                + "<p>" + this.props.website + "</p>";
    return new google.maps.InfoWindow({
      content: content
    });
  },

  render() {
    if(this.info != undefined) {
      if(this.props.$hover) {
        this.info.open(this.map, this.marker);
      }
      else {
        this.info.close();
      }
    }
    return null;
  },
});

export default Marker;
