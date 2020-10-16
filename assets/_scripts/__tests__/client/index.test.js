describe('entry script', () => {
  let registeredEvents ={};
  let eventListenerSpy;

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
