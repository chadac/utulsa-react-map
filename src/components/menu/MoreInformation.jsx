/**
 * @module MoreInformation
 */
import React, {Component, PropTypes} from 'react';
import FluxComponent from '../../hoc/FluxComponent';

import ItemInfo from './ItemInfo';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/MoreInformation.scss';
const cx = classnames.bind(styles);


/**
 * Wrapper class for items with more information.
 * @class
 */
class MoreInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // The list of react elements with more information.
      items: this.createItemInfos(),
    };
  }

  /**
   * Renders all more information blocks.
   * @returns {ReactElement} moreInformation
   */
  render() {
    return (
      <div key="main"
           style={{maxHeight: this.props.height,
                   display: this.props.display ? "" : "none"}}
           className={cx("more-info")}>
        {this.state.items}
      </div>
    );
  }

  /**
   * Creates all of the React wrapper for each item, as an ItemInfo class.
   * These will conditionally display when the item is selected.
   * @returns {Array.<ItemInfo>} itemInfos
   */
  createItemInfos() {
    const itemInfo = this
      .props.items.map((item) => {
        return <ItemInfo key={item.id} data={item}
                         _deselect={this.actions().item.deselect}
                         {...this.itemState(item.id)}/>
      });
    return itemInfo;
  }
}

MoreInformation.propTypes = {
  // Height of the submenu
  height: PropTypes.number.isRequired,
  // True if the menu should be displayed
  display: PropTypes.bool.isRequired,
  // The items
  items: PropTypes.array.isRequired,
};

export default FluxComponent(MoreInformation);
