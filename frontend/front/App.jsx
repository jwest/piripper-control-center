import React, { useState, useEffect } from 'react';

import Toolbar from './Toolbar';
import RippingStatus from './RippingStatus';

const App = () => {
  const [isConnected, setConnected] = useState(false);
  const [rippingStatus, setRippingStatus] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');

    socket.addEventListener('open', () => {
      setConnected(true);
      socket.send(JSON.stringify({ eventName: 'clientReady' }));
    });

    socket.addEventListener('close', () => {
      setConnected(false);
    });

    socket.addEventListener('message', (message) => {
      setRippingStatus(JSON.parse(message.data));
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
