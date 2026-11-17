import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { parallaxStarsApi } from '../api/http';
import { extractErrorMessage, isBackendUnavailable } from '../api/errors';
import { mockCatalogItems, mockFeedStar } from '../data/mockApi';
import type {
  DsParallaxStarCatalogItemSerializer,
  DsParallaxStarDraftSerializer,
  DsParallaxStarFeedSerializer,
  DsPublishParallaxStarRequest,
} from '../api/generated';
import { loggedOut } from './authSlice';
import type { RootState } from './index';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
type DataSource = 'backend' | 'mock';

interface CatalogState {
  items: DsParallaxStarCatalogItemSerializer[];
  status: RequestStatus;
  source: DataSource | null;
  error: string | null;
}

interface FeedState {
  star: DsParallaxStarFeedSerializer | null;
  status: RequestStatus;
  source: DataSource | null;
  error: string | null;
}

interface DraftState {
  item: DsParallaxStarDraftSerializer | null;
  status: RequestStatus;
  error: string | null;
}

interface MutationState {
  status: 'idle' | 'loading';
  error: string | null;
}

interface ParallaxStarsState {
  catalog: CatalogState;
  feed: FeedState;
  draft: DraftState;
  mutation: MutationState;
}

const initialState: ParallaxStarsState = {
  catalog: { items: [], status: 'idle', source: null, error: null },
  feed: { star: null, status: 'idle', source: null, error: null },
  draft: { item: null, status: 'idle', error: null },
  mutation: { status: 'idle', error: null },
};

type ThunkConfig = { state: RootState; rejectValue: string };

// Каталог (плитка) опубликованных звёзд с серверным фильтром по расстоянию.
// Гостю при недоступном бэкенде возвращается коллекция mock-объектов.
export const fetchParallaxStarsCatalog = createAsyncThunk<
  { items: DsParallaxStarCatalogItemSerializer[]; source: DataSource },
  number | undefined,
  ThunkConfig
>('parallaxStars/fetchCatalog', async (distance, { getState, rejectWithValue }) => {
  try {
    const { data } = await parallaxStarsApi.apiParallaxStarsGet(distance);
    return { items: data, source: 'backend' as DataSource };
  } catch (error) {
    if (isBackendUnavailable(error) && getState().auth.status !== 'authenticated') {
      return { items: mockCatalogItems(distance), source: 'mock' as DataSource };
    }
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Лента: одна опубликованная звезда; ?id=...&next=true — следующая.
export const fetchParallaxStarFeed = createAsyncThunk<
  { star: DsParallaxStarFeedSerializer | null; source: DataSource },
  { id?: number; next?: boolean },
  ThunkConfig
>('parallaxStars/fetchFeed', async ({ id, next }, { getState, rejectWithValue }) => {
  try {
    const { data } = await parallaxStarsApi.apiParallaxStarsFeedGet(id, next);
    return { star: data, source: 'backend' as DataSource };
  } catch (error) {
    if (isBackendUnavailable(error) && getState().auth.status !== 'authenticated') {
      return { star: mockFeedStar(id, next), source: 'mock' as DataSource };
    }
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Активный черновик создателя (синглтон). 404 — черновика нет, это не ошибка.
export const fetchParallaxStarDraft = createAsyncThunk<
  DsParallaxStarDraftSerializer | null,
  void,
  ThunkConfig
>('parallaxStars/fetchDraft', async (_, { rejectWithValue }) => {
  try {
    const { data } = await parallaxStarsApi.apiParallaxStarsDraftGet();
    return data;
  } catch (error) {
    if (isBackendUnavailable(error)) {
      return rejectWithValue(extractErrorMessage(error));
    }
    const status = (error as { response?: { status?: number } }).response?.status;
    if (status === 404) return null;
    return rejectWithValue(extractErrorMessage(error));
  }
});

export interface CreateParallaxStarDraftArgs {
  name: string;
  description?: string;
  parallax?: number;
  distance?: number;
  image?: File;
  video?: File;
}

// Шаг 1 добавления услуги: создание черновика с медиафайлами (multipart).
export const createParallaxStarDraft = createAsyncThunk<
  DsParallaxStarDraftSerializer,
  CreateParallaxStarDraftArgs,
  ThunkConfig
>('parallaxStars/createDraft', async (args, { rejectWithValue }) => {
  try {
    const { data } = await parallaxStarsApi.apiParallaxStarsPost(
      args.name,
      args.description,
      args.parallax,
      args.distance,
      args.image,
      undefined,
      args.video
    );
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Шаг 2 добавления услуги: публикация черновика.
export const publishParallaxStar = createAsyncThunk<
  DsParallaxStarFeedSerializer,
  { id: number; request: DsPublishParallaxStarRequest },
  ThunkConfig
>('parallaxStars/publish', async ({ id, request }, { rejectWithValue }) => {
  try {
    const { data } = await parallaxStarsApi.apiParallaxStarsIdPublishPut(id, request);
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Логическое удаление звезды создателем (soft delete).
export const deleteParallaxStar = createAsyncThunk<number, number, ThunkConfig>(
  'parallaxStars/delete',
  async (id, { rejectWithValue }) => {
    try {
      await parallaxStarsApi.apiParallaxStarsIdDelete(id);
      return id;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Установка/отмена лайка текущим пользователем.
export const toggleParallaxStarLike = createAsyncThunk<
  { id: number; isLiked: number; likesCount: number },
  { id: number; like: 0 | 1 },
  ThunkConfig
>('parallaxStars/toggleLike', async ({ id, like }, { rejectWithValue }) => {
  try {
    const { data } = await parallaxStarsApi.apiParallaxStarsIdLikePost(id, { like });
    // Бэкенд возвращает is_liked как bool (в сериализаторе ленты — 0/1)
    const result = data as { is_liked?: boolean | number; likes_count?: number };
    const rawLiked = result.is_liked;
    const isLiked =
      typeof rawLiked === 'boolean' ? (rawLiked ? 1 : 0) : (rawLiked ?? like);
    return {
      id,
      isLiked,
      likesCount: result.likes_count ?? 0,
    };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const parallaxStarsSlice = createSlice({
  name: 'parallaxStars',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Каталог
      .addCase(fetchParallaxStarsCatalog.pending, (state) => {
        state.catalog.status = 'loading';
        state.catalog.error = null;
      })
      .addCase(fetchParallaxStarsCatalog.fulfilled, (state, action) => {
        state.catalog.items = action.payload.items;
        state.catalog.source = action.payload.source;
        state.catalog.status = 'succeeded';
      })
      .addCase(fetchParallaxStarsCatalog.rejected, (state, action) => {
        state.catalog.status = 'failed';
        state.catalog.error = action.payload ?? 'Не удалось загрузить каталог';
      })
      // Лента
      .addCase(fetchParallaxStarFeed.pending, (state) => {
        state.feed.status = 'loading';
        state.feed.error = null;
      })
      .addCase(fetchParallaxStarFeed.fulfilled, (state, action) => {
        state.feed.star = action.payload.star;
        state.feed.source = action.payload.source;
        state.feed.status = 'succeeded';
      })
      .addCase(fetchParallaxStarFeed.rejected, (state, action) => {
        state.feed.status = 'failed';
        state.feed.error = action.payload ?? 'Не удалось загрузить ленту';
      })
      // Черновик
      .addCase(fetchParallaxStarDraft.pending, (state) => {
        state.draft.status = 'loading';
        state.draft.error = null;
      })
      .addCase(fetchParallaxStarDraft.fulfilled, (state, action) => {
        state.draft.item = action.payload;
        state.draft.status = 'succeeded';
      })
      .addCase(fetchParallaxStarDraft.rejected, (state, action) => {
        state.draft.status = 'failed';
        state.draft.error = action.payload ?? 'Не удалось загрузить черновик';
      })
      // Создание черновика
      .addCase(createParallaxStarDraft.pending, (state) => {
        state.mutation.status = 'loading';
        state.mutation.error = null;
      })
      .addCase(createParallaxStarDraft.fulfilled, (state, action) => {
        state.mutation.status = 'idle';
        state.draft.item = action.payload;
        state.draft.status = 'succeeded';
      })
      .addCase(createParallaxStarDraft.rejected, (state, action) => {
        state.mutation.status = 'idle';
        state.mutation.error = action.payload ?? 'Не удалось создать черновик';
      })
      // Публикация
      .addCase(publishParallaxStar.pending, (state) => {
        state.mutation.status = 'loading';
        state.mutation.error = null;
      })
      .addCase(publishParallaxStar.fulfilled, (state) => {
        state.mutation.status = 'idle';
        state.draft = initialState.draft;
      })
      .addCase(publishParallaxStar.rejected, (state, action) => {
        state.mutation.status = 'idle';
        state.mutation.error = action.payload ?? 'Не удалось опубликовать звезду';
      })
      // Удаление
      .addCase(deleteParallaxStar.pending, (state) => {
        state.mutation.status = 'loading';
        state.mutation.error = null;
      })
      .addCase(deleteParallaxStar.fulfilled, (state, action) => {
        state.mutation.status = 'idle';
        state.catalog.items = state.catalog.items.filter((s) => s.id !== action.payload);
        if (state.feed.star?.id === action.payload) {
          state.feed = initialState.feed;
        }
      })
      .addCase(deleteParallaxStar.rejected, (state, action) => {
        state.mutation.status = 'idle';
        state.mutation.error = action.payload ?? 'Не удалось удалить звезду';
      })
      // Лайк
      .addCase(toggleParallaxStarLike.pending, (state) => {
        state.mutation.status = 'loading';
        state.mutation.error = null;
      })
      .addCase(toggleParallaxStarLike.fulfilled, (state, action) => {
        state.mutation.status = 'idle';
        const { id, isLiked, likesCount } = action.payload;
        if (state.feed.star?.id === id) {
          state.feed.star.is_liked = isLiked;
          state.feed.star.likes_count = likesCount;
        }
        const item = state.catalog.items.find((s) => s.id === id);
        if (item) item.likes_count = likesCount;
      })
      .addCase(toggleParallaxStarLike.rejected, (state, action) => {
        state.mutation.status = 'idle';
        state.mutation.error = action.payload ?? 'Не удалось обновить лайк';
      })
      // Выход: сбрасываем черновик и ошибки мутаций (каталог/лента перезапрашиваются)
      .addCase(loggedOut, (state) => {
        state.draft = initialState.draft;
        state.mutation = initialState.mutation;
      });
  },
});

export const parallaxStarsReducer = parallaxStarsSlice.reducer;