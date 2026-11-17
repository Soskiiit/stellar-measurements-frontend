# UsersApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiUsersIdGet**](#apiusersidget) | **GET** /api/users/{id} | Получение информации о пользователе по ID|
|[**apiUsersLoginPost**](#apiusersloginpost) | **POST** /api/users/login | Аутентификация пользователя|
|[**apiUsersLogoutPost**](#apiuserslogoutpost) | **POST** /api/users/logout | Деавторизация пользователя|
|[**apiUsersRegisterPost**](#apiusersregisterpost) | **POST** /api/users/register | Регистрация нового пользователя|

# **apiUsersIdGet**
> DsUserSerializer apiUsersIdGet()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: number; //ID пользователя (default to undefined)

const { status, data } = await apiInstance.apiUsersIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID пользователя | defaults to undefined|


### Return type

**DsUserSerializer**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiUsersLoginPost**
> DsLoginResponse apiUsersLoginPost(request)

Проверяет логин и пароль, возвращает JWT токен и выставляет HTTP-only cookie

### Example

```typescript
import {
    UsersApi,
    Configuration,
    DsUserLoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let request: DsUserLoginRequest; //Учетные данные пользователя

const { status, data } = await apiInstance.apiUsersLoginPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **DsUserLoginRequest**| Учетные данные пользователя | |


### Return type

**DsLoginResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiUsersLogoutPost**
> DsMessageResponse apiUsersLogoutPost()

Отзывает текущий JWT токен и заносит его в черный список (blacklist) Redis

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.apiUsersLogoutPost();
```

### Parameters
This endpoint does not have any parameters.


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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiUsersRegisterPost**
> DsUserSerializer apiUsersRegisterPost(request)

Создает нового пользователя в системе с ролью создателя услуг (Astronomer)

### Example

```typescript
import {
    UsersApi,
    Configuration,
    DsUserRegisterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let request: DsUserRegisterRequest; //Данные регистрации

const { status, data } = await apiInstance.apiUsersRegisterPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **DsUserRegisterRequest**| Данные регистрации | |


### Return type

**DsUserSerializer**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

