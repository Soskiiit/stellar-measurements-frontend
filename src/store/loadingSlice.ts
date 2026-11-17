import { createSlice } from '@reduxjs/toolkit';

// Счётчик выполняющихся AJAX-запросов: пока он больше нуля,
// поверх приложения показывается блокирующая анимация загрузки.
interface LoadingState {
  pending: number;
}

const initialState: LoadingState = {
  pending: 0,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    requestStarted(state) {
      state.pending += 1;
    },
    requestFinished(state) {
      state.pending = Math.max(0, state.pending - 1);
    },
  },
});

export const { requestStarted, requestFinished } = loadingSlice.actions;
export const loadingReducer = loadingSlice.reducer;