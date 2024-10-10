import React, { useEffect, useState } from 'react';
import { useCalculateVoiceVolume } from '../../hooks';
import { Video, VideoContainer, VoiceVisualizer } from '../atoms';

export const RemoteVideo = (props) => {
  const [isFullScreen, setScreenSize] = useState(false);
  const [mediaStream, setMediaStream] = useState();

  useCalculateVoiceVolume(mediaStream, props.id);

  useEffect(() => {
    const interval = setInterval(() => {
      const stream = document.getElementById(props.id).srcObject;

      if (stream) {
        setMediaStream(stream);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [props.id]);

  const toggleSize = () => {
    setScreenSize((size) => !size);
  };

  return (
    <VideoContainer className={isFullScreen ? 'active' : ''}>
      <VoiceVisualizer id={props.id} />
      <Video {...props} />
      <div className="user-name">{props.userName}</div>
      <div className="set-size" onClick={toggleSize}>
        {isFullScreen ? '-' : '+'}
      </div>
    </VideoContainer>
  );
};
