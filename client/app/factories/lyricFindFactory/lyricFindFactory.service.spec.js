'use strict';

describe('Service: lyricFindFactory', function () {

  // load the service's module
  beforeEach(module('hiphopopotamusApp'));

  // instantiate service
  var lyricFindFactory;
  beforeEach(inject(function (_lyricFindFactory_) {
    lyricFindFactory = _lyricFindFactory_;
  }));

  it('should do something', function () {
    expect(!!lyricFindFactory).toBe(true);
  });

});
