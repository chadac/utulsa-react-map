import React, {Component, PropTypes} from 'react';

/**
 * A Higher Order Component (HOC) that allows components to carry all Flux
 * actions/stores/dispatchers with them. This saves on code space.
 **/
const FluxComponent = ComposedComponent => class extends Component {
  static propTypes = Object.assign({}, ComposedComponent.propTypes, {
    dispatcher: PropTypes.object.isRequired,
    stores: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  });

  constructor(props) {
    super(props);

    ComposedComponent.prototype.flux = () => {
      return {
        dispatcher: this.props.dispatcher,
        stores: this.props.stores,
        actions: this.props.actions,
      };
    };

    ComposedComponent.prototype.stores = () => this.props.stores;
    ComposedComponent.prototype.actions = () => this.props.actions;
  }

  render() {
    return <ComposedComponent {...this.props} />;
  }
}

export default FluxComponent;
