import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/Login/styles';
import axios from 'axios';
import React, { useCallback, VFC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const [newUrl, onChangeNewUrl] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const onCreateChannel = useCallback(() => {
    axios
      .post(
        `/api/workspaces/${workspace}/channels`,
        {
          name: newChannel,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        console.log('channel: ', response.data);
        setShowCreateChannelModal(false);
        setNewChannel('');
      })
      .catch((error) => {
        console.dir('e :', error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, [newChannel]);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel}></Input>
        </Label>

        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
