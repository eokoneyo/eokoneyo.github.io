import logger from './logger';

type MakeRequestParams = {
  url: string;
  method?: 'GET' | 'POST';
  headers: Record<string, string>;
  body?: Record<string, string>;
};

const requestClient = <T>({
  url,
  method = 'GET',
  body,
  headers,
}: MakeRequestParams): Promise<T> => {
  const request = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    request.addEventListener('readystatechange', function responseHandler() {
      if (this.readyState === XMLHttpRequest.DONE) {
        const { status, responseText } = this;
        if (status === 0 || (status >= 200 && status < 400)) {
          resolve(JSON.parse(responseText));
        } else {
          reject(new Error(JSON.parse(responseText)));
        }
      }
    });

    request.open(method, url, true);

    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    if (headers) {
      Object.keys(headers).forEach((key) =>
        request.setRequestHeader(key, headers[key])
      );
    }

    logger.debug('making request to %s ...', url);

    if (!body) {
      request.send(null);
    } else {
      const requestBody = new URLSearchParams();
      Object.keys(body).forEach((item) => requestBody.append(item, body[item]));
      request.send(requestBody);
    }
  });
};

export default requestClient;
