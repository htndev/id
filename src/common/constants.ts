export const PROJECT_TITLE = 'xBeat';

export enum HttpMessage {
  WrongEmailOrPassword = 'Wrong email or password',
  UserAuthorized = 'User is already authorized',
  IncorrectData = 'Passed data is incorrect'
}

export enum HttpStatus {
  Conflict = 409,
  NotFound = 404,
  BadRequest = 400
}

export enum AllowedRedirectProps {
  Homepage = 'homepage',
  Artist = 'artist',
  Player = 'player'
}

export const CLIENTS: { [k in AllowedRedirectProps]: string } = {
  [AllowedRedirectProps.Homepage]: process.env.HOMEPAGE_URL || 'http://localhost:7070',
  [AllowedRedirectProps.Player]: process.env.PLAYER_URL || 'http://localhost:6060',
  [AllowedRedirectProps.Artist]: process.env.ARTIST_URL || 'http://localhost:5050'
};

export const ENDPOINTS = {
  PASSPORT: process.env.PASSPORT_URL || 'https://localhost:3000'
};

export const FIELD_LENGTH = {
  EMAIL: {
    MIN: 6,
    MAX: 255
  },
  USERNAME: {
    MIN: 2,
    MAX: 24
  },
  PASSWORD: {
    MIN: 8,
    MAX: 255
  }
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
