import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { extractErrorMessage } from '../api/errors';
import { httpClient } from '../api/http';
import type { DsLoginResponse } from '../api/generated';
import { authFailed, authStarted, authSucceeded } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface AuthPageProps {
  onAuthorized: () => void;
}

// Страница авторизации. Запросы login/register выполняются вручную через axios,
// состояние передаётся в Redux обычными экшенами (без кодогенерации и thunk).
export const AuthPage: React.FC<AuthPageProps> = ({ onAuthorized }) => {
  const dispatch = useAppDispatch();
  const authError = useAppSelector((state) => state.auth.error);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(authStarted());
    try {
      if (mode === 'register') {
        await httpClient.post('/api/users/register', { login, password });
      }
      const { data } = await httpClient.post<DsLoginResponse>('/api/users/login', {
        login,
        password,
      });
      // Токен дублируется в localStorage для демонстрации запросов в Insomnia/Postman.
      // Сессия хранится в httpOnly-cookie (выставляется бэкендом), а состояние
      // Redux не персистится: по F5 приложение возвращается в состояние гостя.
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      dispatch(authSucceeded(data));
      onAuthorized();
    } catch (error) {
      dispatch(authFailed(extractErrorMessage(error)));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-header">{mode === 'login' ? 'Вход' : 'Регистрация'}</h1>

        {authError && (
          <Alert variant="danger" className="auth-error">
            {authError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="auth-field" controlId="auth-login">
            <Form.Label className="auth-label">Логин</Form.Label>
            <Form.Control
              type="text"
              className="auth-input"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="user1"
              maxLength={64}
              required
            />
          </Form.Group>

          <Form.Group className="auth-field" controlId="auth-password">
            <Form.Label className="auth-label">Пароль</Form.Label>
            <Form.Control
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password1"
              maxLength={64}
              required
            />
          </Form.Group>

          <Button type="submit" className="auth-submit-btn">
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </Form>

        <button
          type="button"
          className="auth-toggle-btn"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
        </button>

        <div className="auth-hint">Тестовый аккаунт: user1 / password1</div>
      </div>
    </div>
  );
};