import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";

const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', function () {
  socket.send('Hello Server!');
});

socket.addEventListener('message', function (event) {
  console.log('Message from server ', event.data);
});

ReactDOM.render(<App />, document.getElementById("root"));
