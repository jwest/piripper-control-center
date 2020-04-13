import React from 'react';

const AlbumThumb = ({ src }) => {
  return (
    <figure className="image is-64x64">
      <img src={src} alt="Image" />
    </figure>
  );
};

export default AlbumThumb;
