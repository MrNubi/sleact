import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import loadable from '@loadable/component';

const LogIn = loadable(() => import('../../pages/Login'));
const SignUp = loadable(() => import('../../pages/SignUp'));
const workspace = loadable(() => import('../../layouts/Workspace'));

// 이러면 알아서 코드 스플리팅 하고 알아서 불러옴
// 동적으로 import 된다는 뜻, 해당 코드에 접근하는 순간은 느려질 수도 있지만, 초기속도는 굉장히 개선됨

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/Login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace" component={workspace} />
    </Switch>
  );

  // switch문: 오랜만, 하나가 선택되면 나머지가 꺼진다는 특성 이용 Route path에 많이 씀
  // redirect -> path 안의 것이 나오면 to로 리다이랙트해줌

  //코드 스플리팅: 로딩 최적화를 위해 필요한 컴포넌트만 불러올 수 있도록 쪼개주는 것
  // 일반적 기준: 1. 페이지 별 구분(로딩페이지에서 회원가입페이지까지 미리 불러올 이유 X)
  // 2. server-side-renderring 필요 없는 애들 - 에디터 같은 애들으 굳이 서버에서 랜더링 할 이유 없음
  // 여기선 loadable/component 써서 쓸 것
};

export default App;
