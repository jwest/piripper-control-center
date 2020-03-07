import React, { useState, useEffect } from 'react';

import Toolbar from './Toolbar';
import RippingStatus from './status/RippingStatus';

import {
  ClientMessage,
  StatusMessage,
} from '../messages';

const App = () => {
  const [isConnected, setConnected] = useState(false);
  const [rippingStatus, setRippingStatus] = useState(StatusMessage.idle());

  useEffect(() => {
    let connecting;
    let socket;

    function connectWS() {
      socket = new WebSocket('ws://localhost:3000');

      socket.addEventListener('open', () => {
        connecting !== null && clearInterval(connecting);
        connecting = null;
        setConnected(true);
        ClientMessage.clientReady().send(socket);
      });

      socket.addEventListener('close', () => {
        setConnected(false);

        if (!connecting) {
          connecting = setInterval(() => {
            connectWS();
          }, 1000);
        }
      });

      socket.addEventListener('message', (message) => {
        console.log(`Message: ${JSON.stringify(message)}`);
        setRippingStatus(StatusMessage.fromEvent(message.data));
      });
    }

    connectWS();

    return () => {
      if (isConnected) socket.close();
    };
  }, []);

  return (
    <>
      <Toolbar isConnected={isConnected} />
      <div className="container">
        <RippingStatus rippingStatus={rippingStatus} isConnected={isConnected} />
      </div>
    </>
  );
};

export default App;
