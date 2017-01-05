import React, {Component, PropTypes} from 'react';
import FluxComponent from '../../hoc/FluxComponent';

import ItemInfo from './ItemInfo';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/MoreInformation.scss';
const cx = classnames.bind(styles);


class MoreInformation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: this.createItemInfos(),
    };
  }

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

  createItemInfos() {
    const itemInfo = this
      .props.items.map((item) => {
        return <ItemInfo key={item.id} data={item}
                         {...this.itemState(item.id)} />
      });
    return itemInfo;
  }
}

MoreInformation.propTypes = {
  height: PropTypes.number.isRequired,
  display: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
};

export default FluxComponent(MoreInformation);
