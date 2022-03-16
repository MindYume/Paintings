import PropTypes from 'prop-types';

import './styles.css';

import React from 'react';

export default function Image(props) {
  const { imageUrl } = props;
  const { name } = props;
  const { authorName } = props;
  const { created } = props;
  const { location } = props;

  return (
    <div className="PaintingPanel">
      <img className="PaintingImg" src={imageUrl} alt="" />
      <div className="PaintingInfo">
        <div className="PaintingName">{name}</div>

        <div className="PaintingAdditionalInfo">
          <div className="infoName">Author: </div>
          {authorName}
          {' '}
          <br />

          <div className="infoName">Created: </div>
          {created}
          {' '}
          <br />

          <div className="infoName">Location: </div>
          {location}
        </div>
      </div>
    </div>
  );
}
Image.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};
