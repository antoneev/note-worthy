import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainSection from '../components/unused/MainSection';
import * as ClassRoomActions from '../actions/classroom';
import style from './App.css';

@connect(
  state => ({
    todos: state.todos
  }),
  dispatch => ({
    actions: bindActionCreators(ClassRoomActions, dispatch)
  })
)
export default class App extends Component {

  static propTypes = {
    todos: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { todos, actions } = this.props;
    const { sessionName, started, saving } = todos;

    return (
      <div>
        <Header addSession={actions.addSession} />
        <Footer sessionName={sessionName} started={started} saving={saving} actions={actions} />
      </div>
    );
  }
}
