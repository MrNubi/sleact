import Menu from '../../components/Menu';
import loadable from '@loadable/component';
import axios from 'axios';
import React, { FC, useCallback, useEffect, useState } from 'react';
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

const Channel = loadable(() => import('../../pages/Channel'));
const DirectMessage = loadable(() => import('../../pages/DirectMessage'));

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 2000,
    errorRetryCount: 10,
  });

  const [showUserMenu, setShowUserMenu] = useState(false);

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

  const onClickUserProfile = useCallback(() => {
    console.log('showUserMenu :', showUserMenu);
    setShowUserMenu((prev) => !prev);

    console.log('showUserMenu2 :', showUserMenu);
  }, []);
  console.log('showUserMenu3 :', showUserMenu);
  console.log('data check workspace: ', data);

  // if (!data) {
  //   console.log('data check back to login: ', data);
  //   return <Redirect to="/login" />;
  // }

  return (
    <div>
      <Header>
        <span onClick={onClickUserProfile}>
          <ProfileImg src="../../img/leaf_toy.png" alt="fail to load profile" />
          {showUserMenu && (
            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
              <ProfileModal>
                <img src="../../img/leaf_toy.png" />
                <div>
                  <span id="profile-name">닉네임</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>
          )}
        </span>
      </Header>

      <WorkspaceWrapper>
        <Workspaces>workspaces</Workspaces>
        <Channels>
          <WorkspaceName>Select</WorkspaceName>
          <MenuScroll>menuScroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
