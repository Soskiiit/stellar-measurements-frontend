import axios from 'axios';
import { ParallaxStarsApi } from './generated';

// Единый axios-инстанс: запросы идут на тот же origin (Vite proxy /api -> бэкенд),
// JWT-куки access_token/token браузер отправляет автоматически.
export const httpClient = axios.create({
  withCredentials: true,
});

// Сгенерированный из swagger API домена услуг (звёзд) поверх того же инстанса.
// Авторизация — через cookie, поэтому Configuration с токеном не нужна.
export const parallaxStarsApi = new ParallaxStarsApi(undefined, '', httpClient);