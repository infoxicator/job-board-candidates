/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { animated, interpolate } from 'react-spring/hooks';

const Card = ({
  i, x, y, rot, scale, trans, bind, data,
}) => {
  const {
    name, text, pics, profileUrl,
  } = data[i];

  return (
    <animated.div
      key={i}
      style={{
        transform: interpolate(
          [x, y],
          (w, z) => `translate3d(${w}px,${z}px,0)`
        ),
      }}
    >
      <animated.div
        {...bind(i)}
        style={{
          transform: interpolate([rot, scale], trans),
        }}
      >
        <div>
          <img src={pics} key={i} alt="profilePicture" />
          <h2>{name}</h2>
          <h5>{text}</h5>
          <button type="button" className="button is-fullwidth" onClick={() => window.open(profileUrl, '_blank')}>View Profile</button>
        </div>
      </animated.div>
    </animated.div>
  );
};

export default Card;
