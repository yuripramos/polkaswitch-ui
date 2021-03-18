'use strict';

var _ = require('underscore');

/**
 * Incremental Backoff Poller
 * From Github's own internal polling logic
 * https://github.com/blog/467-smart-js-polling
 *
 * @param {number} wait initial wait time between calls
 * @param {function(retry_counter, retry_fn)} fn block to get called,
 *    retry_fn passed as arg to intitiate the next poll
 *
 */

var backOffPoller = function(wait, fn) {
  if (_.isFunction(wait)) {
    fn = wait;
    wait = 2000;
  }

  var counter = 0;

  (function start() {
    setTimeout(function() {
      fn.call(this, counter, start);
    }, wait);
    wait *= 1.25;
    counter += 1;
  })();
};

module.exports = {
  backOffPoller: backOffPoller
};
