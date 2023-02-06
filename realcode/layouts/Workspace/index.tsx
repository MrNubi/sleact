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
} from '@layouts/Workspace/styles';
import loadable from '@loadable/component';

const Channel = loadable(() => import('../../pages/Channel'));
const DirectMessage = loadable(() => import('../../pages/DirectMessage'));

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 2000,
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
  if (!data) {
    console.log('data check back to login: ', data);
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src="../../img/leaf_toy.png" alt={'user.email'} />
          </span>
        </RightMenu>
      </Header>

      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspace>test</Workspace>
        <Channels>
          <WorkspaceName>sleact</WorkspaceName>
          <MenuScroll>menu Scroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace:workspace/channel" component={Channel} />
            <Route path="/workspace:workspace/dm" component={DirectMessage} />
            {/* 계층적 라우팅시 주의사항: 자식 라우터는 부모 라우터의 주소를 
                  반드시 포함하고 있어야 한다, 안그러면 안나옴
                  -> 주소 잘 안짜면 머리 터짐, 계층적이면 이런식이 나음*/}
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
