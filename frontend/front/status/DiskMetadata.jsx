import React from 'react';

const DiskMetadata = ({ rippingStatus }) => {
  const discId = rippingStatus.getMetaData('discId');
  const artist = rippingStatus.getMetaData('artist');
  const title = rippingStatus.getMetaData('title');
  const duration = rippingStatus.getMetaData('duration');
  const musicBrainzLookupUrl = rippingStatus.getMetaData('musicBrainzLookupUrl');

  return (
    <div className="content">
      <p>
        <strong>{ !!title ? title : 'Loading metadata...' }</strong>
        { !!artist && <><br />{ artist }</> }
        { !!discId && <><br /><small>DiskId: { discId }</small></> }
        { !!musicBrainzLookupUrl && <><br /><small><a href={musicBrainzLookupUrl}>Edit release on MusicBrainz</a></small></> }
        { !!duration && <><br /><small>(duration: { duration })</small></> }
      </p>
    </div>
  );
};

export default DiskMetadata;
