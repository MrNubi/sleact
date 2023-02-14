import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import { IDM, IUser } from '@typings/db';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '../../utills/fetcher';
import { Container, Header } from './styles';
import autosize from 'autosize';
import axios from 'axios';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: memberData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then((r) => {
            console.log('r.succes  ', r);
            mutateChat(r.data);
            setChat('');
          })
          .catch(console.error);
      }
    },
    [chat],
  );

  return (
    <Container>
      <Header>
        <img
          height={20}
          width={20}
          src="https://search.pstatic.net/sunny/?src=https%3A%2F%2Fcdn-icons.flaticon.com%2Fpng%2F512%2F5580%2Fpremium%2F5580909.png%3Ftoken%3Dexp%3D1637875670%7Ehmac%3D6300bc79cbb88dc219c822fcdfb1f495&type=a340"
          alt="상대 프로필: 지금은 못만들었음"
        />
        {`${memberData?.nickname}님 과의 대화`}
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};
export default DirectMessage;
