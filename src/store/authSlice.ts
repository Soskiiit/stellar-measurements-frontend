import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DsLoginResponse, DsUserSerializer } from '../api/generated';
import type { RootState } from './index';

// Состояние интерфейса после авторизации. Хранится только в памяти Redux:
// по F5 приложение возвращается в состояние гостя, хотя JWT-кука остаётся.
// Запросы login/logout выполняются вручную через axios (без кодогенерации и thunk),
// а состояние передаётся в Redux обычными экшенами ниже.
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

interface AuthState {
  user: DsUserSerializer | null;
  accessToken: string | null;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStarted(state) {
      state.status = 'loading';
      state.error = null;
    },
    authSucceeded(state, action: PayloadAction<DsLoginResponse>) {
      state.user = action.payload.user ?? null;
      state.accessToken = action.payload.access_token ?? null;
      state.status = 'authenticated';
      state.error = null;
    },
    authFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    loggedOut() {
      return initialState;
    },
  },
});

export const { authStarted, authSucceeded, authFailed, loggedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.status === 'authenticated' && state.auth.user != null;