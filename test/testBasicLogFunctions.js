var util = require('util');
var should = require('should');

var logger = require('../lib/logger');

var testObject = {
  one: '1',
  two: '2',
  myThing: function () {
    return 'boo';
  },
  getContext: function () {
    return util.format('one: %s, two: %s', this.one, this.two);
  },
  mychild: {
    self: this,
    three: '3',
    four: '4',
    getContext: function () {
      return util.format('three:%s, four:%s', this.three, this.four);
    },
    testLoggerStack: function () {
      logger.error('test context stack');
    }
  }
};

describe('Logger', function () {

  it('can log a debug message', function (done) {
    logger.debug('my message');
    done();
  });

  it('can log a debug message with additional context object', function (done) {
    var extraContext = {myContext: 'blah'};
    logger.debug('my message', extraContext);
    done();
  });

  it('can inspect basic error object', function(done){
    try{
      throw new Error('my error');
    }catch(err){
      logger.error('my message with error', err)
    }
    done();
  });

  it('can log extra context functions', function(done){
    testObject.mychild.testLoggerStack();
    done()
  });

});