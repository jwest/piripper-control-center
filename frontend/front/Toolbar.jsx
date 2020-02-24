import React from 'react';

const Toolbar = ({ isConnected }) => {
  return (
    <div>
      <h1>PiRipper</h1>
      { (isConnected) ? 'Connected' : 'Disconnected' }
    </div>
  );
};

export default Toolbar;
