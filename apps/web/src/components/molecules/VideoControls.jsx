import React, { useState } from 'react';
import { Button } from '../atoms';

export const VideoControls = ({ isScreenShared, onScreenShare, setVideo, setAudio, isAudio, muteUnmute, isMute }) => {
  const handleScreenShare = () => {
    onScreenShare(!isScreenShared);
  };

  return (
    // replace with styled component
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div>
        <Button onClick={handleScreenShare}>{isScreenShared ? 'Cancel Sharing' : 'Share Screen'}</Button>
        <Button onClick={muteUnmute}>{!isMute ? 'Mute' : 'UnMute'}</Button>
        {/*<Button onClick={isAudio ? setVideo : setAudio}>*/}
        {/*  {isAudio ? 'Включить веб камеру' : 'Выключить веб камеру'}*/}
        {/*</Button>*/}
      </div>
    </div>
  );
};
