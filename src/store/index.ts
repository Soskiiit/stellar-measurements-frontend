import { configureStore } from '@reduxjs/toolkit';
import { httpClient } from '../api/http';
import { authReducer } from './authSlice';
import { filterReducer } from './filterSlice';
import { loadingReducer, requestFinished, requestStarted } from './loadingSlice';
import { parallaxStarsReducer } from './parallaxStarsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filter: filterReducer,
    parallaxStars: parallaxStarsReducer,
    loading: loadingReducer,
  },
});

// Любой AJAX-запрос (сгенерированный API и ручной axios авторизации)
// увеличивает счётчик загрузки; ответ/ошибка — уменьшает.
httpClient.interceptors.request.use((config) => {
  store.dispatch(requestStarted());
  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    store.dispatch(requestFinished());
    return response;
  },
  (error) => {
    store.dispatch(requestFinished());
    return Promise.reject(error);
  }
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;