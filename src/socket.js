import SockJS from 'sockjs-client';
import { Stomp } from 'stompjs/lib/stomp';

export function initializeSocket(messageCallback, connectCallback, errorCallback) { // eslint-disable-line
  const socket = new SockJS(`${appUrl}/chat-socket`);
  const stompClient = Stomp.over(socket);
  stompClient.debug = null;
  stompClient.reconnect_delay = 5000;
  stompClient.connect({}, () => {
    stompClient.subscribe('/topic/message', (data) => {
      const message = JSON.parse(data.body);
      messageCallback(message);
    });
    connectCallback();
  }, errorCallback);

  return obj => stompClient.send('/gouomp/broadcastMessage', {}, JSON.stringify(obj));
}
