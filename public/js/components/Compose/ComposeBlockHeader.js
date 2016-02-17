import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';

import Input from '../Base/Input';

export default class ComposeBlockHeader extends Component {
  constructor(props) {
    super(props);
    const { heading } = this.props;

    this.state = {
      heading: heading ? heading.charAt(0).toUpperCase() + heading.slice(1) : ''
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  onChange(event) {
    const { id, onSave } = this.props;
    const value = event.target.value
    this.setState({ heading: value });
    onSave(id, value);
  }

  render() {
    return (
      <div className={ styles.composeBlockHeader }>
        <Input
          className={ styles.composeBlockHeaderText }
          type="text"
          value={ this.state.heading }
          onChange={ this.onChange.bind(this) }/>
      </div>
    );
  }
}

ComposeBlockHeader.propTypes = {
  heading: PropTypes.string,
  id: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
};
