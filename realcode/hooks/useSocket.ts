import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095';

const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  console.log('rerender', workspace);
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);
  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;

// import React, { useCallback } from 'react';
// import { useParams } from 'react-router';
// import io, { Socket } from 'socket.io-client';

// const sockets: { [key: string]: SocketIOClient.Socket } = {};
// const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
//   // socket.io 쓸거면 범위를 진짜 잘 조절해야됨

//   const backUrl = 'http://localhost:3095/';
//   sockets[workspace ? workspace : ''] = io.connect(`${backUrl}/ws-${workspace}`, {
//     transports: ['websocket'],
//   });
//   const disconnect = useCallback(() => {
//     if (workspace) {
//       sockets[workspace].disconnect();
//       delete sockets[workspace];
//     }
//   }, [workspace]);
//   if (!workspace) {
//     console.log('useSocket: workspace가 없습니다');
//     return [undefined, disconnect];
//   }

//   sockets[workspace].emit('hello', 'world');
//   // socket.emit('hello', 'world'); => 서버에 hello란 이벤트 이름으로 world라는 데이터를 보냄
//   sockets[workspace].on('message', (data: any) => {
//     console.log(data);
//   });
//   sockets[workspace].on('data', (data: any) => {
//     console.log(data);
//   });
//   // socket.on('name', fn) => 서버에서 클라이언트로 보내는 데이터 중 name이 일치하는 값 받음, 그리고 콜백함수
//   //이벤트명이 일치해야 받음

//   // 맺은 연결을 끊는 함수

//   return [sockets[workspace], disconnect];
// };

// export default useSocket;
