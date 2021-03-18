var _ = require('underscore');
var Promise = require('lie');

module.exports = {
  send: function(path, opts) {
    var url = path;

    opts = _.extend({
      url: url,
      method: "GET",
      data: {},
      dataType: 'json',
      responseType: 'json',
      timeout: 5 * 60 * 1000 // increase to 5 min timeout, 30sec too short
    }, opts);

    var method = opts.method.toLowerCase();
    var data = opts.data;
    var xhrPresendConfig = opts.xhrPresendConfig;

    opts.headers = opts.headers || {};

    if (_.contains(['post', 'put', 'patch', 'delete'], method)) {
      opts.headers['X-CSRF-TOKEN'] = csrfToken;
    }

    var _opts = _.omit(opts, ['method', 'data', 'xhrPresendConfig']);

    return new Promise(function (resolve, reject) {
      qwest[method](url, data, _opts, xhrPresendConfig)
        .then(function(xhr, data) {
          resolve(data);
        })
        .catch(function(xhr, response, error) {
          var status = (xhr && xhr.status) || 0;

          reject({
            error: error,
            status: status,
            response: response
          });
        });
    });
  },
};
