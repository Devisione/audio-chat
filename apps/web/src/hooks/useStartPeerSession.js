import { useEffect, useMemo, useState } from 'react';
import { createPeerConnectionContext } from '../utils/PeerConnectionSession';

export const useStartPeerSession = (room, userMediaStream, localVideoRef, userName) => {
  const peerVideoConnection = useMemo(() => createPeerConnectionContext(), []);

  const [displayMediaStream, setDisplayMediaStream] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    if (userMediaStream && !peerVideoConnection.senders.length) {
      peerVideoConnection.joinRoom(room, userName);
      peerVideoConnection.onAddUser((user) => {
        console.log(user);
        setConnectedUsers((users) => [...users, user]);
        peerVideoConnection.addPeerConnection(`${user.id}`, userMediaStream, (_stream) => {
          document.getElementById(user.id).srcObject = _stream;
        });
        peerVideoConnection.callUser(user.id);
      });

      peerVideoConnection.onRemoveUser((socketId) => {
        setConnectedUsers((users) => users.filter((user) => user.id !== socketId));
        peerVideoConnection.removePeerConnection(socketId);
      });

      peerVideoConnection.onUpdateUserList(async (users) => {
        console.log(users);
        setConnectedUsers(users);
        for (const user of users) {
          peerVideoConnection.addPeerConnection(`${user.id}`, userMediaStream, (_stream) => {
            document.getElementById(user.id).srcObject = _stream;
          });
        }
      });

      peerVideoConnection.onAnswerMade((socket) => peerVideoConnection.callUser(socket));
    }
  }, [peerVideoConnection, room, userMediaStream, userName]);

  useEffect(async () => {
    const items = Object.keys(peerVideoConnection.peerConnections);
    if (items.length > 0) {
      for (const idPair of items) {
        await peerVideoConnection.replaceStream(idPair, userMediaStream);
      }
    }
  }, [userMediaStream]);

  const cancelScreenSharing = async () => {
    for (const idPair of Object.keys(peerVideoConnection.peerConnections)) {
      await peerVideoConnection.replaceStream(idPair, userMediaStream);
    }

    localVideoRef.current.srcObject = userMediaStream;
    displayMediaStream.getTracks().forEach((track) => track.stop());
    setDisplayMediaStream(null);
  };

  const shareScreen = async () => {
    const stream = displayMediaStream || (await navigator.mediaDevices.getDisplayMedia());

    for (const idPair of Object.keys(peerVideoConnection.peerConnections)) {
      await peerVideoConnection.replaceStream(idPair, stream);
    }

    stream.getVideoTracks()[0].addEventListener('ended', () => {
      cancelScreenSharing(stream);
    });

    localVideoRef.current.srcObject = stream;

    setDisplayMediaStream(stream);
  };

  return {
    connectedUsers,
    peerVideoConnection,
    shareScreen,
    cancelScreenSharing,
    isScreenShared: !!displayMediaStream,
  };
};
