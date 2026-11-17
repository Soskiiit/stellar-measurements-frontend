import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Менеджер состояния фильтра услуг (звёзд) по расстоянию.
// null — фильтр не применён (показываются все опубликованные звёзды).
// При выходе пользователя фильтр сбрасывается (resetFilter).
interface FilterState {
  distance: number | null;
}

const initialState: FilterState = {
  distance: null,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setDistanceFilter(state, action: PayloadAction<number | null>) {
      state.distance = action.payload;
    },
    resetFilter() {
      return initialState;
    },
  },
});

export const { setDistanceFilter, resetFilter } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;