import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './SessionNameInput.css';

export default class SessionNameInput extends Component {

  static propTypes = {
    onSave: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    this.state = { text: '' };
  }

  handleChange = (evt) => {
    this.setState({ text: evt.target.value.trim() });
  };

  handleBlur = (evt) => {
    this.props.onSave(evt.target.value.trim());
  };

  render() {
    return (
      <input
        className={style.new}
        type="text"
        placeholder={this.props.placeholder}
        autoFocus="true"
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        disabled={this.props.disabled}
      />
    );
  }
}
