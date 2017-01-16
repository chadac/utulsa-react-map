/**
 * @module ItemStateComponent
 */
import React, {Component, PropTypes} from 'react';

/**
 * A Higher Order Component (HOC) that synchronizes an item's state with the
 * Item Store, accessible to the sub-component at <object>.props.item
 *
 * This method is helpful since there are many different types of classes that
 * need to track item state, and the general React process is slow when there
 * are thousands of items. Independent updates are generally best in this case.
 *
 * @param {React.Component} ComposedComponent The component to be extended.
 * @returns {React.Component} The new flux component.
 */
const ItemStateComponent = ComposedComponent => {
  class ItemStateHOC extends Component {
    constructor(props) {
      super(props);

      this.state = {
        itemState: this.props._getItemState(this.props.id),
      }
    }

    /**
     * Before the component renders.
     * @returns {void}
     */
    componentWillMount() {
      this.props._register(this._onItemStateChange.bind(this), this.props.id);
    }

    /**
     * Renders the component with our props passed.
     * @returns {void}
     */
    render() {
      return <ComposedComponent {...this.props} item={this.state.itemState} />
    }

    /**
     * Updates internal state whenever the item state is changed.
     * @returns {void}
     */
    _onItemStateChange() {
      this.setState({itemState: this.props._getItemState(this.props.id)});
    }
  }

  ItemStateHOC.propTypes = {
    id: PropTypes.string.isRequired,

    _register: PropTypes.func.isRequired,
    _getItemState: PropTypes.func.isRequired,
  };

  return ItemStateHOC;
};

export default ItemStateComponent;
