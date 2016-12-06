import React, {Component, PropTypes} from 'react';

import assign from 'object-assign';

/**
 * A Higher Order Component (HOC) that allows components to carry all Flux
 * actions/stores/dispatchers with them. This saves on code space.
 *
 * @param {React.Component} ComposedComponent The component to be extended.
 *
 * @returns {React.Component} The new flux component.
 **/
const ItemStateHOC = ComposedComponent => {
  class ItemStateComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        itemState: this.props._getItemState(this.props.id),
      }
    }

    componentWillMount() {
      this.props._register(this._onItemStateChange.bind(this), this.props.id);
    }

    render() {
      return <ComposedComponent {...this.props} item={this.state.itemState} />
    }

    _onItemStateChange() {
      this.setState({itemState: this.props._getItemState(this.props.id)});
    }
  }

  ItemStateComponent.propTypes = assign({}, ComposedComponent.propTypes, {
    id: PropTypes.string.isRequired,

    _register: PropTypes.func.isRequired,
    _getItemState: PropTypes.func.isRequired,
  });

  return ItemStateComponent;
};

export default ItemStateHOC;
