import { ClientEndpoint } from '@xbeat/toolkit';

export const PROJECT_TITLE = 'xBeat';

export enum HttpMessage {
  WrongEmailOrPassword = 'Wrong email or password',
  UserAuthorized = 'User is already authorized',
  IncorrectData = 'Passed data is incorrect'
}

export const CLIENTS: { [k in ClientEndpoint]: string } = {
  [ClientEndpoint.Homepage]: process.env.HOMEPAGE_URL || 'http://localhost:7070',
  [ClientEndpoint.Player]: process.env.PLAYER_URL || 'http://localhost:6060',
  [ClientEndpoint.Artist]: process.env.ARTIST_URL || 'http://localhost:5050'
};

export const ENDPOINTS = {
  PASSPORT: process.env.PASSPORT_URL || 'http://localhost:3000'
};

export const ALLOWED_PATH = {
  SIGN_IN: 'signin',
  SIGN_UP: 'signup',
  FORGOT_PASSWORD: 'forgot-password',
  PASSWORD_RECOVERY: 'recover',
  EMAIL_CONFIRMATION: 'confirm'
};

export enum Language {
  EN = 'English',
  RU = 'Русский',
  UK = 'Українська',
  DE = 'Deutsche'
}
