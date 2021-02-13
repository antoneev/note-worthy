import * as types from '../constants/ActionTypes';

export function addSession(sessionName) {
  return { type: types.ADD_SESSION, sessionName };
}

export function startSession(sessionName) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log('{PAWAN} sessionName: ', sessionName);
    chrome.tabs.sendMessage(tabs[0].id, {data: "start", sessionName}, function(response) {
      console.log('{PAWAN} response: ', response);
    });
  });
  return { type: types.START_SESSION };
}

export function stopSession(sessionName) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {data: "stop"}, function(response) {});
  });
  return { type: types.STOP_SESSION };
}

// export function deleteTodo(id) {
//   return { type: types.DELETE_TODO, id };
// }
//
// export function editTodo(id, text) {
//   return { type: types.EDIT_TODO, id, text };
// }
//
// export function completeTodo(id) {
//   return { type: types.COMPLETE_TODO, id };
// }
//
// export function completeAll() {
//   return { type: types.COMPLETE_ALL };
// }
//
// export function clearCompleted() {
//   return { type: types.CLEAR_COMPLETED };
// }
