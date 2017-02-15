/**
 * Handles query params passed to the app, and updates the Flux state accordingly.
 *
 * @module Map
 */

import {Component} from 'react'

import FluxComponent from '../hoc/FluxComponent';

import url from 'url';

class QueryParams extends Component {
  constructor(props) {
    super(props);

    this.state = {
      params: {}
    };
  }

  componentDidMount() {
    this._getParams();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState;
  }

  render() {
    return null;
  }

  componentDidUpdate() {
    this._update();
  }

  _getParams() {
    let query = url.parse(window.location.href, true).query;
    this.setState({params: query});
  }

  _update() {
    let query = this.state.params;

    if('zoom' in query)
      this.actions().gmaps.zoom(parseInt(query.zoom));

    if('center' in query) {
      let coords = query.center.split(',');
      this.actions().gmaps.center(parseFloat(coords[0]), parseFloat(coords[1]));
    }

    if('select' in query)
      this.actions().item.select(query.select);

    if('filter' in query) {
      let categories = query.filter.split(',');
      this.actions().item.resetCategories();
      categories.forEach((category) =>
        this.actions().item.addCategory(category)
      );
    }
  }
}

export default FluxComponent(QueryParams);
