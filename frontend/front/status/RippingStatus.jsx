import React from 'react';

import AlbumThumb from './AlbumThumb';
import ProgressBar from './ProgressBar';
import DiskMetadata from './DiskMetadata';
import IdleStatusBox from './IdleStatusBox';

const RippingStatus = ({ rippingStatus, isConnected }) => {
  if (rippingStatus.isIdle()) {
    return (
      <IdleStatusBox />
    );
  }

  return (
    <div className="box column is-6">
      <article className="media">
        <div className="media-left">
          <AlbumThumb src={'https://bulma.io/images/placeholders/128x128.png'} />
        </div>
        <div className="media-content">
          <DiskMetadata rippingStatus={rippingStatus} />
          <hr />
          <ProgressBar rippingStatus={rippingStatus} isConnected={isConnected} />
        </div>
      </article>
    </div>
  );
};

export default RippingStatus;
