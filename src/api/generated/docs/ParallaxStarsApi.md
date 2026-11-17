# ParallaxStarsApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiParallaxStarsDraftGet**](#apiparallaxstarsdraftget) | **GET** /api/parallax_stars/draft | Черновик текущего пользователя|
|[**apiParallaxStarsFeedGet**](#apiparallaxstarsfeedget) | **GET** /api/parallax_stars/feed | Лента опубликованных звезд (Vibes)|
|[**apiParallaxStarsGet**](#apiparallaxstarsget) | **GET** /api/parallax_stars | Список опубликованных звезд каталога|
|[**apiParallaxStarsIdDelete**](#apiparallaxstarsiddelete) | **DELETE** /api/parallax_stars/{id} | Логическое удаление звезды (soft delete)|
|[**apiParallaxStarsIdLikePost**](#apiparallaxstarsidlikepost) | **POST** /api/parallax_stars/{id}/like | Установка или отмена лайка|
|[**apiParallaxStarsIdPublishPut**](#apiparallaxstarsidpublishput) | **PUT** /api/parallax_stars/{id}/publish | Публикация черновика звезды|
|[**apiParallaxStarsPost**](#apiparallaxstarspost) | **POST** /api/parallax_stars | Добавление новой звезды (черновик) с медиафайлами|

# **apiParallaxStarsDraftGet**
> DsParallaxStarDraftSerializer apiParallaxStarsDraftGet()

Возвращает активный черновик услуги-звезды авторизованного создателя (синглтон, не более 1 на пользователя)

### Example

```typescript
import {
    ParallaxStarsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParallaxStarsApi(configuration);

const { status, data } = await apiInstance.apiParallaxStarsDraftGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**DsParallaxStarDraftSerializer**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiParallaxStarsFeedGet**
> DsParallaxStarFeedSerializer apiParallaxStarsFeedGet()

Возвращает опубликованную звезду для вертикальной ленты с признаком is_liked. При параметрах ?id=...&next=true возвращается следующая звезда.

### Example

```typescript
import {
    ParallaxStarsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParallaxStarsApi(configuration);

let id: number; //Текущий ID звезды (optional) (default to undefined)
let next: boolean; //Перейти к следующей звезде (optional) (default to undefined)

const { status, data } = await apiInstance.apiParallaxStarsFeedGet(
    id,
    next
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Текущий ID звезды | (optional) defaults to undefined|
| **next** | [**boolean**] | Перейти к следующей звезде | (optional) defaults to undefined|


### Return type

**DsParallaxStarFeedSerializer**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiParallaxStarsGet**
> Array<DsParallaxStarCatalogItemSerializer> apiParallaxStarsGet()

Возвращает опубликованные звезды с поддержкой серверной фильтрации по расстоянию. Для авторизованных пользователей признак is_creator (1/0) указывает авторство текущего пользователя.

### Example

```typescript
import {
    ParallaxStarsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParallaxStarsApi(configuration);

let distance: number; //Максимальное расстояние до звезды (пк) (optional) (default to undefined)

const { status, data } = await apiInstance.apiParallaxStarsGet(
    distance
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **distance** | [**number**] | Максимальное расстояние до звезды (пк) | (optional) defaults to undefined|


### Return type

**Array<DsParallaxStarCatalogItemSerializer>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiParallaxStarsIdDelete**
> DsMessageResponse apiParallaxStarsIdDelete()

Переводит статус услуги в deleted с помощью SQL UPDATE. Доступно только создателю.

### Example

```typescript
import {
    ParallaxStarsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParallaxStarsApi(configuration);

let id: number; //ID звезды (default to undefined)

const { status, data } = await apiInstance.apiParallaxStarsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID звезды | defaults to undefined|


### Return type

**DsMessageResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiParallaxStarsIdLikePost**
> { [key: string]: any; } apiParallaxStarsIdLikePost(request)

Добавляет (like=1) или удаляет (like=0) лайк от текущего авторизованного пользователя

### Example

```typescript
import {
    ParallaxStarsApi,
    Configuration,
    DsLikeParallaxStarRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParallaxStarsApi(configuration);

let id: number; //ID звезды (default to undefined)
let request: DsLikeParallaxStarRequest; //Параметр like (1 или 0)

const { status, data } = await apiInstance.apiParallaxStarsIdLikePost(
    id,
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **DsLikeParallaxStarRequest**| Параметр like (1 или 0) | |
| **id** | [**number**] | ID звезды | defaults to undefined|


### Return type

**{ [key: string]: any; }**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiParallaxStarsIdPublishPut**
> DsParallaxStarFeedSerializer apiParallaxStarsIdPublishPut(request)

Переводит черновик текущего создателя в статус published, рассчитывает расстояние и выставляет дату завершения

### Example

```typescript
import {
    ParallaxStarsApi,
    Configuration,
    DsPublishParallaxStarRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ParallaxStarsApi(configuration);

let id: number; //ID звезды (default to undefined)
let request: DsPublishParallaxStarRequest; //Параметры публикации

const { status, data } = await apiInstance.apiParallaxStarsIdPublishPut(
    id,
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **DsPublishParallaxStarRequest**| Параметры публикации | |
| **id** | [**number**] | ID звезды | defaults to undefined|


### Return type

**DsParallaxStarFeedSerializer**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiParallaxStarsPost**
> DsParallaxStarDraftSerializer apiParallaxStarsPost()

Создает черновик услуги с автозаполнением создателя из JWT токена и загрузкой фото/видео в MinIO

### Example

```typescript
import {
    ParallaxStarsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParallaxStarsApi(configuration);

let name: string; //Название звезды (default to undefined)
let description: string; //Краткое описание (optional) (default to undefined)
let parallax: number; //Годичный параллакс (угловые секунды) (optional) (default to undefined)
let distance: number; //Расстояние до звезды (пк) (optional) (default to undefined)
let image: File; //Изображение звезды (optional) (default to undefined)
let pic: File; //Альтернативное имя поля изображения (optional) (default to undefined)
let video: File; //Видеоролик звезды (optional) (default to undefined)

const { status, data } = await apiInstance.apiParallaxStarsPost(
    name,
    description,
    parallax,
    distance,
    image,
    pic,
    video
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | Название звезды | defaults to undefined|
| **description** | [**string**] | Краткое описание | (optional) defaults to undefined|
| **parallax** | [**number**] | Годичный параллакс (угловые секунды) | (optional) defaults to undefined|
| **distance** | [**number**] | Расстояние до звезды (пк) | (optional) defaults to undefined|
| **image** | [**File**] | Изображение звезды | (optional) defaults to undefined|
| **pic** | [**File**] | Альтернативное имя поля изображения | (optional) defaults to undefined|
| **video** | [**File**] | Видеоролик звезды | (optional) defaults to undefined|


### Return type

**DsParallaxStarDraftSerializer**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

