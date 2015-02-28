'use strict';

describe('Service: text', function () {

  // load the service's module
  beforeEach(module('hiphopopotamusApp'));

  // instantiate service
  var text;
  beforeEach(inject(function (_text_) {
    text = _text_;
  }));

  it('should do something', function () {
    expect(!!text).toBe(true);
  });

});
