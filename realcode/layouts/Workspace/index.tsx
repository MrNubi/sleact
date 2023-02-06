import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR from 'swr';
import fetcher from '../../utills/fetcher';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '../Workspace/styles';

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 2000,
    errorRetryCount: 10,
  });

  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then((response) => {
        console.log('앞data : ', data);
        mutate(response.data, false);
        console.log('rd:: ', response.data);
        console.log('뒤data : ', data);
      });
  }, []);

  console.log('data check workspace: ', data);

  // if (!data) {
  //   console.log('data check back to login: ', data);
  //   return <Redirect to="/login" />;
  // }

  return (
    <div>
      <Header>
        <span>
          <ProfileImg src="../../img/leaf_toy.png" alt="fail to load profile" />
        </span>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>workspaces</Workspaces>
        <Channels>
          <WorkspaceName>Select</WorkspaceName>
          <MenuScroll>menuScroll</MenuScroll>
        </Channels>
        <Chats>chats</Chats>
        {children}
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
