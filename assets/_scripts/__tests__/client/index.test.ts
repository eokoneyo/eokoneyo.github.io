describe('entry script', () => {
  let registeredEvents: Record<string, EventListener> = {};
  let eventListenerSpy: jest.SpyInstance

  beforeEach(() => {
    eventListenerSpy = jest.spyOn(document, 'addEventListener');

    eventListenerSpy.mockImplementation((evtName, cb) => {
      registeredEvents[evtName] = cb;
    });
  });

  afterEach(() => {
    registeredEvents = {};
    eventListenerSpy.mockReset();
  });

  it('registers an event handler for DOMContentLoaded', () => {
    // eslint-disable-next-line global-require
    require('../../client');

    // eslint-disable-next-line dot-notation
    expect(registeredEvents['DOMContentLoaded']).toBeDefined();
  });
});
