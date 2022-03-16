import PropTypes from 'prop-types';

import './styles.css';

import React, { Component, createRef } from 'react';

export default class InputName extends Component {
  constructor(props) {
    super(props);

    this.inputField = createRef();

    this.state = {
      value: '',
    };

    this.handleValueInput = this.handleValueInput.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(event) {
    this.setState({ value: event.target.value });
  }

  handleValueInput(event) {
    const { value } = this.state;
    const { onSubmit } = this.props;

    onSubmit(value);
    event.preventDefault();
  }

  render() {
    const { value } = this.state;
    const { isDarkTheme } = this.props;

    let inputStyle = 'InputName';

    if (isDarkTheme) {
      inputStyle += 'Dark';
    }

    return (
      <div>
        <form onSubmit={this.handleValueInput}>
          <input className={inputStyle} type="text" placeholder="Name" value={value} onChange={this.handleValueChange} ref={this.inputField} />
        </form>
      </div>
    );
  }
}
InputName.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isDarkTheme: PropTypes.bool.isRequired,
};
