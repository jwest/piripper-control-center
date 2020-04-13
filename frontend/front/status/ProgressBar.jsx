import React from 'react';

const ProgressBar = ({ rippingStatus, isConnected }) => {
  const allTrackNo = parseInt(rippingStatus.getMetaData('allTrackNo'), 10);
  const trackNo = parseInt(rippingStatus.getMetaData('trackNo'), 10);
  const trackName = rippingStatus.getMetaData('trackName');

  const storingProgress = rippingStatus.isStoringStart();
  const progressPercent = !storingProgress && isConnected && parseInt((trackNo / allTrackNo) * 100, 10);
  const progress = !!progressPercent;

  return (
    <div>
      { !storingProgress && progress && <>
        { !!allTrackNo && !!trackNo ? <>
          <span className="has-text-primary">{ progressPercent }%</span> <small>({ trackNo } / { allTrackNo } - {trackName})</small>
          {!isConnected && <small className={isConnected ? 'has-text-success' : 'has-text-danger'}>ripper disconnected</small>}
        </> : <small>Loading tracks metadata</small> }
      </>}
      { storingProgress && <><span>Storing cd rip...</span></> }
      { progress && <progress className="progress is-primary" max="100" value={ progressPercent }>{ progressPercent }%</progress> }
      { !progress && <progress className="progress is-primary" max="100">%</progress> }
    </div>
  );
};

export default ProgressBar;
