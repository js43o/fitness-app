import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { userSelector } from 'modules/hooks';
import Title from 'templates/Title';
import useErrorMessage from 'hooks/useErrorMessage';
import { login, register } from 'modules/user';
import Button from 'components/common/Button';
import useAuth from 'hooks/useAuth';

const AuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  .error_wrapper {
    height: 1rem;
  }
`;

const AuthBlock = styled.div<{ type: string }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    label {
      display: flex;
      flex-direction: column;
      position: relative;
      font-size: 0.85rem;
      color: ${({ theme }) => theme.letter_sub};
    }
  }
  .link {
    align-self: end;
    font-weight: bold;
  }
`;

const KakaoLoginButton = styled(Button)`
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  color: black;
  background: ${({ theme }) => theme.yellow};
  img {
    margin-top: 0.2rem;
    width: 1rem;
  }
`;

const SubmitButton = styled(Button)`
  padding: 0.5rem;
  color: ${({ theme }) => theme.letter_primary};
  background: ${({ theme }) => theme.primary};
`;

type Authprops = {
  type: 'register' | 'login';
};

const Auth = ({ type }: Authprops) => {
  const { error, authErrorCode, user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { REACT_APP_KAKAO_API, REACT_APP_KAKAO_REDIRECT } = process.env;

  const {
    state: { username, password, passwordConfirm, nickname },
    onChangeInput,
    onCheckInputs,
  } = useAuth();
  const { onError, resetError, ErrorMessage } = useErrorMessage();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === 'register') {
      if (
        !onCheckInputs(username, 'username') ||
        !onCheckInputs(password, 'password') ||
        !onCheckInputs(nickname, 'nickname')
      ) {
        onError('???????????? ????????? ???????????? ????????????.');
        return;
      }
      if (password !== passwordConfirm) {
        onError('??????????????? ???????????? ????????????.');
        return;
      }
      dispatch(register({ username, password, nickname }));
    } else {
      if (!username || !password) {
        onError('?????????/??????????????? ???????????????.');
        return;
      }
      dispatch(login({ username, password }));
    }
  };

  useEffect(() => {
    if (!error) return;

    switch (authErrorCode) {
      case 401:
        onError('????????? ????????? ???????????? ????????????.');
        break;
      case 409:
        onError('?????? ?????? ???????????? ???????????????.');
        break;
      default:
        onError('?????? ??? ?????? ??????????????????.');
        break;
    }
  }, [error]);

  useEffect(() => {
    resetError();
  }, [type]);

  useEffect(() => {
    if (user.username) {
      navigate('/');
    }
  }, [user]);

  return (
    <AuthWrapper>
      <Title />
      <AuthBlock type={type}>
        <form onSubmit={onSubmit}>
          <label htmlFor="username">
            <input
              type="text"
              id="username"
              placeholder="?????????"
              maxLength={20}
              value={username}
              onChange={(e) => onChangeInput('username', e)}
            />
            {type === 'register' &&
              '??? ?????? ?????????/?????? ?????? 5-20??? (???????????? (-),(_) ??????)'}
          </label>
          <label htmlFor="password">
            <input
              type="password"
              id="password"
              placeholder="????????????"
              maxLength={20}
              value={password}
              onChange={(e) => onChangeInput('password', e)}
            />
          </label>
          {type === 'register' && (
            <>
              <label htmlFor="passwordConfirm">
                <input
                  type="password"
                  id="passwordConfirm"
                  placeholder="???????????? ??????"
                  maxLength={20}
                  value={passwordConfirm}
                  onChange={(e) => onChangeInput('passwordConfirm', e)}
                />
                ??? ?????? ????????????/??????/???????????? ?????? 8-20???
              </label>
              <label htmlFor="nickname">
                <input
                  type="text"
                  id="nickname"
                  placeholder="?????????"
                  maxLength={10}
                  value={nickname}
                  onChange={(e) => onChangeInput('nickname', e)}
                />
                ??? ??????/?????? ????????????/?????? 1-10???
              </label>
            </>
          )}
          <SubmitButton type="submit">
            {type === 'register' ? '?????? ??????' : '?????????'}
          </SubmitButton>
        </form>
        {type === 'login' && (
          <a
            href={`https://kauth.kakao.com/oauth/authorize?client_id=${REACT_APP_KAKAO_API}&redirect_uri=${REACT_APP_KAKAO_REDIRECT}&response_type=code`}
          >
            <KakaoLoginButton>
              <img
                src={`${process.env.PUBLIC_URL}/kakao.png`}
                alt="kakao_logo"
              ></img>
              <span>????????? ?????????</span>
            </KakaoLoginButton>
          </a>
        )}
        <NavLink
          to={type === 'register' ? '/login' : '/register'}
          className="link"
        >
          {type === 'register' ? '????????? ???' : '?????? ?????? ???'}
        </NavLink>
      </AuthBlock>
      <div className="error_wrapper">
        <ErrorMessage />
      </div>
    </AuthWrapper>
  );
};

export default Auth;
