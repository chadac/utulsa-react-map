/**
 * @typedef {Object} FluxInfo
 * @property {AppDispatcher} dispatcher The app dispatcher object.
 * @property {Array} stores Array of stores.
 * @property {Array} actions Array of action wrappers.
 */
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

      /**
       * Helper method to return all flux objects.
       * @returns {FluxInfo} Flux objects.
       */
      ComposedComponent.prototype.flux = () => {
        return {
          dispatcher: this.props.dispatcher,
          stores: this.props.stores,
          actions: this.props.actions,
        };
      };

      /**
       * Helper method to return properties necessary to instantiate a React
       * component with an ItemStateHOC wrapper.
       * @param {*} id The ID of the item.
       * @returns {Object} params
       */
      ComposedComponent.prototype.itemState = (id) => {
        return {
          id: id,
          _register: this.props.stores.item.addStateChangeListener.bind(this.props.stores.item),
          _getItemState: this.props.stores.item.getItemState.bind(this.props.stores.item),
        };
      };

      /**
       * Helper method to retrieve all stores.
       * @returns {Object} Dictionary of stores available.
       */
      ComposedComponent.prototype.stores = () => this.props.stores;

      /**
       * Helper method to retrieve all actions.
       * @returns {Object} Dictionary of actions available.
       */
      ComposedComponent.prototype.actions = () => this.props.actions;
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  FluxComponentHOC.propTypes = Object.assign({}, ComposedComponent.propTypes, {
    // The App Dispatcher
    dispatcher: PropTypes.object.isRequired,
    // Dictionary of stores. (see src/index.jsx for the structure used in our program)
    stores: PropTypes.object.isRequired,
    // Dictionary of actions.
    actions: PropTypes.object.isRequired,
  });

  return FluxComponentHOC;
};

export default FluxComponent;
