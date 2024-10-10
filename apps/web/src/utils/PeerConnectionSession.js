import * as io from 'socket.io-client';

const { RTCPeerConnection, RTCSessionDescription } = window;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class PeerConnectionSession {
  _onConnected;
  _onDisconnected;
  _room;
  peerConnections = {};
  senders = [];
  listeners = {};

  constructor(socket) {
    this.socket = socket;
    this.onCallMade();
  }

  addPeerConnection(id, stream, callback) {
    this.peerConnections[id] = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    stream.getTracks().forEach((track) => {
      this.senders.push(this.peerConnections[id].addTrack(track, stream));
    });

    this.listeners[id] = (event) => {
      const fn = this['_on' + capitalizeFirstLetter(this.peerConnections[id].connectionState)];
      fn && fn(event, id);
    };

    this.peerConnections[id].addEventListener('connectionstatechange', this.listeners[id]);

    this.peerConnections[id].ontrack = function ({ streams: [stream] }) {
      console.log({ id, stream });
      callback(stream);
    };

    console.log(this.peerConnections);
  }

  removePeerConnection(id) {
    this.peerConnections[id].removeEventListener('connectionstatechange', this.listeners[id]);
    delete this.peerConnections[id];
    delete this.listeners[id];
  }

  isAlreadyCalling = false;

  async callUser(to) {
    if (this.peerConnections[to].iceConnectionState === 'new') {
      const offer = await this.peerConnections[to].createOffer();
      await this.peerConnections[to].setLocalDescription(new RTCSessionDescription(offer));

      this.socket.emit('call-user', { offer, to });
    }
  }

  onConnected(callback) {
    this._onConnected = callback;
  }

  onDisconnected(callback) {
    this._onDisconnected = callback;
  }

  joinRoom(room, userName) {
    this._room = room;
    this.socket.emit('joinRoom', { room, userName });
  }

  onCallMade() {
    this.socket.on('call-made', async (data) => {
      await this.peerConnections[data.socket].setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await this.peerConnections[data.socket].createAnswer();
      await this.peerConnections[data.socket].setLocalDescription(new RTCSessionDescription(answer));

      this.socket.emit('make-answer', {
        answer,
        to: data.socket,
      });
    });
  }

  onAddUser(callback) {
    this.socket.on(`${this._room}-add-user`, async ({ user }) => {
      callback(user);
    });
  }

  onRemoveUser(callback) {
    this.socket.on(`${this._room}-remove-user`, ({ socketId }) => {
      callback(socketId);
    });
  }

  onUpdateUserList(callback) {
    this.socket.on(`${this._room}-update-user-list`, ({ users, current }) => {
      callback(users, current);
    });
  }

  onAnswerMade(callback) {
    this.socket.on('answer-made', async (data) => {
      await this.peerConnections[data.socket].setRemoteDescription(new RTCSessionDescription(data.answer));
      callback(data.socket);
    });
  }

  // Новая функция для замены потока (с аудио на видео или наоборот)
  async replaceStream(id, newStream) {
    const peerConnection = this.peerConnections[id];
    if (!peerConnection) {
      throw new Error(`PeerConnection for user ${id} does not exist`);
    }

    // Заменяем или добавляем треки
    newStream.getTracks().forEach((newTrack) => {
      const sender = peerConnection.getSenders().find((s) => s.track?.kind === newTrack.kind);

      if (sender) {
        // Если трек уже есть такого типа (аудио или видео), просто заменяем его
        sender.replaceTrack(newTrack);
      } else {
        peerConnection.getSenders().forEach((sender) => {
          peerConnection.removeTrack(sender);
        });
        // Если нет трека такого типа, добавляем новый
        this.senders.push(peerConnection.addTrack(newTrack, newStream));
      }
    });

    // Теперь делаем повторную сигнализацию
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    // Отправляем новый offer через сокет на другой конец
    this.socket.emit('call-user', {
      offer,
      to: id, // отправляем offer конкретному пользователю
    });
  }

  clearConnections() {
    this.socket.close();
    this.senders = [];
    Object.keys(this.peerConnections).forEach(this.removePeerConnection.bind(this));
  }
}

export const createPeerConnectionContext = () => {
  const socket = io(process.env.REACT_APP_SOCKET_URL);

  return new PeerConnectionSession(socket);
};
