import { HttpStatus } from '@xbeat/toolkit';

import { HttpMessage } from './constants';

export const parseGqlError = ({
  graphQLErrors: [
    {
      extensions: {
        exception: {
          response: { statusCode }
        }
      },
      message
    }
  ]
}: any) => ({ statusCode, message });

export const isAuthorized = (e: any) => {
  const { statusCode, message } = parseGqlError(e);

  return statusCode === HttpStatus.Conflict && message === HttpMessage.UserAuthorized;
};

export const isWrongEmailOrPassword = (e: any) => {
  const { statusCode, message } = parseGqlError(e);
  return statusCode === HttpStatus.Conflict && message === HttpMessage.WrongEmailOrPassword;
};
