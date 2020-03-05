import React, { useState, useEffect } from 'react';

import Toolbar from './Toolbar';
import RippingStatus from './RippingStatus';

import {
  ClientMessage,
  StatusMessage,
} from '../messages';

//https://bulma.io/
//https://getbootstrap.com/docs/4.4/getting-started/introduction/

const App = () => {
  const [isConnected, setConnected] = useState(false);
  const [rippingStatus, setRippingStatus] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');

    socket.addEventListener('open', () => {
      setConnected(true);
      ClientMessage.clientReady().send(socket);
    });

    socket.addEventListener('close', () => {
      setConnected(false);
    });

    socket.addEventListener('message', (message) => {
      setRippingStatus(StatusMessage.fromEvent(message.data));
    });

    return () => {
      if (isConnected) socket.close();
    };
  }, []);

  return (
    <>
      <Toolbar isConnected={isConnected} />
      <RippingStatus rippingStatus={rippingStatus} />
    </>
  );
};

export default App;
