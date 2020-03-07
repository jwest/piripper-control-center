import React from 'react';

const IdleStatusBox = () => {
  return (
    <div className="box column is-6">
      <div className="content">
        <h4>Waiting for ripping...</h4>
        <progress className="progress is-small" max="100">0%</progress>
      </div>
    </div>
  );
};

export default IdleStatusBox;
