import useInput from '../../hooks/useInput';
import axios, { AxiosResponse } from 'axios';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from './styles';

const SignUp = () => {
  const [email, onChangeEmail, setEmail] = useInput('');
  const [nickname, onChangeNickname, setNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [mismatchError, setmismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setmismatchError(e.target.value !== passwordCheck);
      console.log('setmismatchError', mismatchError);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setmismatchError(e.target.value !== password);
      console.log('setmismatchError', mismatchError);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log(email, nickname, password, passwordCheck);
      setSignUpSuccess(false);
      setSignUpError('');
      if (mismatchError === false) {
        console.log('non-error -> 회원가입요청전송');
        axios
          .post(
            '/api/users',
            {
              email,
              nickname,
              password,
            },
            {
              withCredentials: true,
            },
          )
          .then((response: AxiosResponse<any>) => {
            //성공 시 코드
            setSignUpSuccess(true);
            console.log(response);
          })
          .catch((error) => {
            //실패시 코드
            console.log(error.response);
            setSignUpError(error.response.data);
            //비동기 요청 안에 setState같은거 넣을 때는 비동기 요청전에 초기화시켜주는게 좋다
            //요청이 연달아 날아갈 경우, 처음 요청때 변경된 코드가 다음 요청때 반영될 수 있기 때문
          })
          .finally(() => {
            //성공하든 실패하든 얘는 무조건 실행
          });
      }
    },
    [email, nickname, password, passwordCheck, mismatchError],
  );
  // useCallback 함수는 자체적으로 [email, nickname, password, passwordCheck] 안의 값이
  //바뀌기 전 까지 함수의 결과값을 캐싱하고있음
  //[] 안에는 함수 기준 외부 함수만, 변화를 감지시켜야 할 것들만 잘 골라서 쓰기

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {/* {/* {!nickname && <Error>닉네임을 입력해주세요.</Error>} */}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
