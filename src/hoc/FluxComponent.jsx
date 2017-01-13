import React, {Component, PropTypes} from 'react';

/**
 * A Higher Order Component (HOC) that allows components to carry all Flux
 * actions/stores/dispatchers with them. This saves on code space.
 *
 * @param {React.Component} ComposedComponent The component to be extended.
 *
 * @returns {React.Component} The new flux component.
 **/
const FluxComponent = ComposedComponent => {
  class FluxComponentHOC extends Component {
    constructor(props) {
      super(props);

      ComposedComponent.prototype.flux = () => {
        return {
          dispatcher: this.props.dispatcher,
          stores: this.props.stores,
          actions: this.props.actions,
        };
      };
      ComposedComponent.prototype.itemState = (id) => {
        return {
          id: id,
          _register: this.props.stores.item.addStateChangeListener.bind(this.props.stores.item),
          _getItemState: this.props.stores.item.getItemState.bind(this.props.stores.item),
        };
      };

      ComposedComponent.prototype.stores = () => this.props.stores;
      ComposedComponent.prototype.actions = () => this.props.actions;
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  FluxComponentHOC.propTypes = Object.assign({}, ComposedComponent.propTypes, {
    dispatcher: PropTypes.object.isRequired,
    stores: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  });

  return FluxComponentHOC;
};

export default FluxComponent;
