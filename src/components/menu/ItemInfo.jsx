/**
 * @module ItemInfo
 */
import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/MoreInformation.scss';
const cx = classnames.bind(styles);

/**
 * A photo gallery for images of the item.
 * @class
 */
class PhotoGallery extends Component {
  constructor(props) {
    super(props)

    this.state = {
      index: 0
    };
  }

  render() {
    let images = this.props.photos.map((photo, index) => (
      <li key={photo} className={cx({active: this.state.index === index})}>
        <span className={cx("helper")}></span>
        <img src={photo} />
      </li>
    ));
    let nav = [
      <div className={cx("nav", "left-nav")} onClick={this._prev.bind(this)}>
        <i className={cx("material-icons")}>keyboard_arrow_left</i>
      </div>,
      <div className={cx("nav", "right-nav")} onClick={this._next.bind(this)}>
        <i className={cx("material-icons")}>keyboard_arrow_right</i>
      </div>
    ];
    return (
      <div className={cx("photo-gallery", {"has-multiple": this.props.photos.length > 1})}>
        {this.props.photos.length > 1 ? nav : null}
        <ul>
          {images}
        </ul>
        {this.props.photos.length > 1 ?
         <div className={cx("photo-index")}>{this.state.index + 1}/{this.props.photos.length}</div>
         : null}
      </div>
    );
  }

  _next() {
    let numImages = this.props.photos.length;
    this.setState({index: (this.state.index + 1) % numImages});
  }

  _prev() {
    let numImages = this.props.photos.length;
    this.setState({index: (this.state.index + numImages - 1) % numImages});
  }
}

PhotoGallery.propTypes = {
  photos: PropTypes.array.isRequired,
};


class PlaceInfo extends Component {
  listingBlock(key, name, className) {
    let block = null;
    if(typeof this.props.data[key] !== "undefined") {
      const items = this.props.data[key].map((item) => (<li key={item}>{item}</li>));
      block = (
        <div className={className}>
          <h4>{name}</h4>
          <ul>
            {items}
          </ul>
        </div>
      );
    }
    return block;
  }

  render() {
    // Directions
    const loc = typeof this.props.data.directions !== "undefined" ?
                this.props.data.directions :
                [this.props.data.marker.lat, this.props.data.marker.lng].join(',');
    const directionsUrl = "https://www.google.com/maps/dir//'" + loc + "'/@" + loc + ",17z";

    // Listings
    const alternateNames = this.listingBlock("alternate_names", "Also Called:", cx("alternate-names", "listing"));
    const departments = this.listingBlock("departments", "Departments & Offices", cx("departments", "listing"));
    const rooms = this.listingBlock("rooms", "Rooms", cx("rooms", "listing"));
    const data = this.props.data;
    return (
      <div className={cx("item-info")}>
        <h1 className={cx("header")}>{data.name}</h1>
        {data.photos && data.photos.length > 0 ? <PhotoGallery photos={data.photos} /> : <br />}
        <div className={cx("address")}>{data.address} (<a target="_blank" href={directionsUrl}>Directions</a>)</div>
        {alternateNames}
        {/* Setting inner HTML allows for styling the description */}
        <p className={cx("description")}
           dangerouslySetInnerHTML={{__html: data.description}}></p>
        {departments}
        {rooms}
      </div>
    );
  }
}
PlaceInfo.propTypes = {
  data: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};


class SimpleMarkerInfo extends Component {
  description() {
    let type = this.props.data.label;
    switch(type) {
      case "Emergency Phone/Strobe":
        return "The Blue Light Telephone System increases safety and prevents crime by enabling people to reach Campus Security quickly from multiple locations around campus. The phones are located and marked by signs and by distinctive blue lights, so they are visible 24 hours a day. Campus Security can identify the caller’s location immediately and dispatch an officer to that location.";
      case "Bike Rack":
        return "Bike racks are located in multiple places around campus near dorms, apartments and classroom buildings to provide riders with ways to secure their bike while on campus.";
      case "Bike Repair Station":
        return "Three freestanding bike maintenance stations on the TU campus feature bike-specific tools and pumps with Presta and Shrader valves. Cyclists can air up their tires or make minor adjustments and repairs. Two of the three stations were paid for by TU’s Student Association.";
      case "Photo Opportunity":
        return "Visitors, alum and perspective student love to take pictures at various place around. Picturesque locations have been marked with the camera icon.";
    }
    return null;
  }
  render() {
    let data = this.props.data;
    return (
      <div className={cx("item-info", data.id)}>
        <h2 className={cx("header")}>{data.label}</h2>
        {data.photos && data.photos.length > 0 ? <PhotoGallery photos={data.photos} /> : <br />}
        <p className={cx("description")}><div>{this.description()}</div></p>
      </div>
    );
  }
}
SimpleMarkerInfo.propTypes = {
  data: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};


class ParkingLotInfo extends Component {
  render() {
    let data = this.props.data;
    return (
      <div className={cx("item-info")}>
        <h2 className={cx("header")}>{data.name}</h2>
        <p className={cx("hours")}>Hours: {data.hours}</p>
        <p className={cx("description")}><div>The University of Tulsa provides designated visitor parking for guests visiting campus. Lots reserved for visitors are indicated in gold. Other parking lots are reserved for residential students, commuter students, faculty and staff.</div></p>
      </div>
    );
  }
}
ParkingLotInfo.propTypes = {
  data: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};


class RouteInfo extends Component {
  render() {
    let data = this.props.data;
    return (
      <div className={cx("item-info")}>
        <h2>{data.name}</h2>
        <p className={cx("description")}>Hours: {data.hours}</p>
      </div>
    );
  }
}
RouteInfo.propTypes = {
  data: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};


/**
 * Displays information about the item. This will eventually grow to be very
 * complex, so I've got it stored here.
 * @class
 */
class ItemInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let state = this.props.item,
        data = this.props.data;
    // Don't show it if it isn't selected
    // We do this from here rather than the parent element for performance.
    if(!state.$selected) return null;

    let Info = null;
    switch(data.type) {
      case 'place':
        Info = PlaceInfo;
        break;
      case 'simple_marker':
        Info = SimpleMarkerInfo;
        break;
      case 'parking_lot':
        Info = ParkingLotInfo;
        break;
      case 'route':
        Info = RouteInfo;
        break;
    }

    return (
      <div>
        <div className={cx("exit", "material-icons")} onClick={this.close.bind(this)}>clear</div>
        <Info item={state} data={data} />
      </div>
    );
  }


  close() {
    this.props._deselect();
  }
}

ItemInfo.propTypes = {
  // Item state
  item: PropTypes.object.isRequired,
  // Item data
  data: PropTypes.object.isRequired,

  _deselect: PropTypes.func.isRequired,
};


export default ItemStateHOC(ItemInfo);
