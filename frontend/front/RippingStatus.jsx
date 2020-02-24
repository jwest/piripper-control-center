import React from 'react';

const RippingStatus = ({ rippingStatus }) => {
  return (
    <div>
      <div>Status:</div>
      <pre>{(JSON.stringify(rippingStatus))}</pre>
    </div>
  );
};

export default RippingStatus;
