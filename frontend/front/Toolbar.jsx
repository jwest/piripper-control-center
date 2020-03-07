import React from 'react';

const Toolbar = ({ isConnected }) => {
  return (
    <section className="hero is-dark is-bold">
      <div className="hero-body">
        <div className="container">
          <h1 className="title is-marginless">PiRipper</h1>
          <small className={isConnected ? 'has-text-success' : 'has-text-danger'}>
            { (isConnected) ? 'Connected' : 'Disconnected' }
          </small>
        </div>
      </div>
    </section>
  );
};

export default Toolbar;
