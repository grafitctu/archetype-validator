(() => {
  'use strict';
  const cfg = window.ARCHETYPE_CONFIG || {};
  const namespace = /^[a-z0-9_]+$/.test(cfg.STORAGE_NAMESPACE || '') ? cfg.STORAGE_NAMESPACE : 'standalone';
  const proto = Storage.prototype;
  const get = proto.getItem;
  const set = proto.setItem;
  const remove = proto.removeItem;
  const scoped = key => /^(vip_)?archetype_/.test(String(key)) ? namespace + '_' + key : key;

  proto.getItem = function(key) {
    if (this !== window.localStorage) return get.call(this, key);
    const value = get.call(this, scoped(key));
    // Read existing identity/progress as a starting point, without changing old storage.
    if (value === null && cfg.INHERIT_EXISTING_PROGRESS !== false && /(?:_participant_id|_current_index|_order_20261110)$/.test(String(key))) {
      const existing = get.call(this, key);
      if (existing !== null) {
        try { set.call(this, scoped(key), existing); } catch (error) { /* Keep readable progress if quota is full. */ }
      }
      return existing;
    }
    return value;
  };
  proto.setItem = function(key, value) {
    return set.call(this, this === window.localStorage ? scoped(key) : key, value);
  };
  proto.removeItem = function(key) {
    return remove.call(this, this === window.localStorage ? scoped(key) : key);
  };

  const originalFetch = window.fetch.bind(window);
  const endpoint = String(cfg.GOOGLE_SHEETS_WEB_APP_URL || '').trim();
  window.fetch = function(input, init) {
    const url = typeof input === 'string' ? input : String(input && input.url || '');
    if (endpoint && url.indexOf(endpoint) === 0 && String(init && init.method || '').toUpperCase() === 'POST' && typeof init.body === 'string') {
      try {
        const payload = JSON.parse(init.body);
        payload.sheetName = cfg.RESPONSE_SHEET_NAME;
        payload.validatorVariant = cfg.VALIDATOR_VARIANT;
        payload.vip = cfg.VALIDATOR_VARIANT === 'vip';
        init = Object.assign({}, init, { body: JSON.stringify(payload) });
      } catch (error) {
        // Preserve an existing non-JSON request unchanged.
      }
    }
    return originalFetch(input, init);
  };
})();
