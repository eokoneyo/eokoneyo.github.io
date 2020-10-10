import logdown, { Logger } from 'logdown';

export default (function instantiateLogger(): Logger {
  // eslint-disable-next-line no-underscore-dangle
  let _logger;

  const createLogger = () => logdown('eoe');

  if (!_logger) {
    _logger = createLogger();
  }

  return _logger;
})();
