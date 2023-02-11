import Menu from '../../components/Menu';
import loadable from '@loadable/component';
import axios from 'axios';
import React, { useCallback, useState, VFC } from 'react';
import { Route, Switch } from 'react-router';
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
import { IUser } from '../../typings/db';
import { Link } from 'react-router-dom';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/Login/styles';
import useInput from '@hooks/useInput';
import { toast } from 'react-toastify';
import CreateChannelModal from '../../components/CreateChannelModal';

const Channel = loadable(() => import('../../pages/Channel'));
const DirectMessage = loadable(() => import('../../pages/DirectMessage'));

const Workspace: VFC = () => {
  const {
    data: UserData,
    error,
    mutate,
  } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showWorkspacesModal, setShowWorkspacesModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkpsace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const onClickUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  console.log('showUserMenu3 :', showUserMenu);

  console.log('UserData LastCheck: ', UserData);

  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then((response) => {
        mutate(response.data, false);
        console.log('onLogOut :', response.data);
      })
      .catch((error) => {
        alert(error.response.data ? error.response.data : '애러 캐치 실패');
      });
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspacesModal((prev) => !prev);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          '/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          console.log('modalData :', response);
          mutate();

          setShowCreateWorkspaceModal(false);
          setNewWorkpsace('');
          setNewUrl('');
          console.log('data check CreateWS: ', UserData);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  // if (!data) {
  //   console.log('data check back to login: ', data);
  //   return <Redirect to="/login" />;
  // }

  return (
    <div>
      <Header>
        <span onClick={onClickUserProfile}>
          <ProfileImg src="/leaf.png" alt="fail to load profile" />
          {showUserMenu && (
            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
              <ProfileModal>
                <img src="/leaf.png" />
                <div>
                  <span id="profile-name">{UserData ? UserData.nickname : 'false'}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>
          )}
        </span>
      </Header>

      <WorkspaceWrapper>
        <Workspaces>
          {UserData?.Workspaces?.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.id}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>
            {/* {UserData?.Workspaces.find((v)=>{})} */}
            sleact
          </WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspacesModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>workspace 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}></Input>
          </Label>
          <Label id="workspace-url-label">
            <span>workspace url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl}></Input>
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      ></CreateChannelModal>
    </div>
  );
};

export default Workspace;
