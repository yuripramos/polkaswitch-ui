
window.Metrics = {
  identify: function(userid) {
    if (window.mixpanel) {
      window.mixpanel.identify(userid);
    }
  },

  track: function(key, props) {
    if (window.mixpanel) {
      window.mixpanel.track(key, props);
    }
  }
};

module.exports = window.Metrics;

