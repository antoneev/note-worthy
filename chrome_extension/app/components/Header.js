import React, { PropTypes, Component } from 'react';
import SessionNameInput from './SessionNameInput';

export default class Header extends Component {

  static propTypes = {
    addSession: PropTypes.func.isRequired
  };

  handleSave = (text) => {
    if (text.length !== 0) {
      this.props.addSession(text);
    }
  };

  render() {
    return (
      <header>
        <img src="img/caption.png" alt="Extension logo"/>
        <h2 className="live-caption-title">Class Room</h2>
        <p className="description">Class Room provides you the suite of features to make virtual classes fun and engaging.</p>
        <SessionNameInput
            onSave={this.handleSave}
            placeholder="Class Name?"
        />
      </header>
    );
  }
}
