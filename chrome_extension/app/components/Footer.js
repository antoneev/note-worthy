import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';
import style from './Footer.css';


export default class Footer extends Component {

  static propTypes = {
    sessionName: PropTypes.string.isRequired,
    started: PropTypes.bool.isRequired,
    saving: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  handleStart = () => {
    const { sessionName, startSession } = this.props.actions;
    console.log('{PAWAN} sessionName: ', sessionName);
    if (sessionName) {
      startSession(sessionName);
    }
  };

  handleStop = () => {
    const { stopSession } = this.props.actions;
    stopSession();
  };

  handleDashboard = () => {};

  render() {
    return (
      <footer className={style.buttonsContainer}>
        <button onClick={this.handleStart} type="activation-button">START</button>
        <button onClick={this.handleStop} type="deactivation-button">STOP</button>
        <button onClick={this.handleDashboard} type="dashboard-button">DASHBOARD</button>
      </footer>
    );
  }
}
