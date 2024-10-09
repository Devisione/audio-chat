import { useCallback, useEffect, useState } from 'react';

export const useCreateMediaStream = (localVideoRef) => {
  const [userMediaStream, setUserMediaStream] = useState(null);
  const [isAudio, setIsAudio] = useState(true);

  const setVideo = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 640, ideal: 1920 },
        height: { min: 400, ideal: 1080 },
        aspectRatio: { ideal: 1.7777777778 },
      },
      audio: true,
    });

    localVideoRef.current.srcObject = stream;

    setUserMediaStream(stream);
    setIsAudio(false);
  }, []);

  const setAudio = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    localVideoRef.current.srcObject = stream;

    setUserMediaStream(stream);
    setIsAudio(true);
  }, []);

  useEffect(() => {
    setAudio();
  }, [localVideoRef]);

  return { userMediaStream, isAudio, setVideo, setAudio };
};
