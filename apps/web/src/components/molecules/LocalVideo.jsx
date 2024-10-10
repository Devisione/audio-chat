import React, { forwardRef, useState } from 'react';
import { Video, VideoContainer, VoiceVisualizer } from '../atoms';

export const LocalVideo = forwardRef((props, ref) => {
  const [isFullScreen, setScreenSize] = useState(false);

  // it causes echoing local video voice even if we past mute prop to video element.
  // useCalculateVoiceVolume(ref?.current?.srcObject, 'local');
  const toggleSize = () => {
    setScreenSize((size) => !size);
  };

  return (
    <VideoContainer className={isFullScreen ? 'active' : ''}>
      <VoiceVisualizer id="local" />
      <Video {...props} ref={ref} />
      <div className="user-name">{props.userName}</div>
      <div className="set-size" onClick={toggleSize}>
        {isFullScreen ? '-' : '+'}
      </div>
    </VideoContainer>
  );
});
