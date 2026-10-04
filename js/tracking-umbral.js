/* Non-visual tracking, shared by all checkout handlers. */
(() => {
  'use strict';
  if (window.UmbralTracking) return;
  const pixel = '1698121791282770';
  const entry = new URLSearchParams(location.search);
  const keys = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
    'utm_term', 'src', 'sck', 'fbclid', 'gclid']);
  let contentSent = false;
  let checkoutSent = false;
  const originals = new WeakMap();

  function isCheckout(url) {
    return url.protocol === 'https:' && url.hostname === 'pay.hotmart.com' &&
      url.pathname === '/Y107863640L' &&
      ['zgb1dcnz', 'hycslxm6'].includes(url.searchParams.get('off'));
  }

  function preserveUrl(value) {
    const url = new URL(value, document.baseURI);
    if (!isCheckout(url)) return url.href;
    const protectedParameters = new URLSearchParams(url.search);
    entry.forEach((item, key) => {
      if (keys.has(key) || key.startsWith('utm_') ||
          !protectedParameters.has(key)) url.searchParams.set(key, item);
    });
    return url.href;
  }

  function initiateCheckout(data = {}) {
    if (checkoutSent || typeof window.fbq !== 'function') return;
    checkoutSent = true;
    window.fbq('trackSingle', pixel, 'InitiateCheckout', data);
  }

  function viewContent() {
    if (contentSent || document.visibilityState === 'hidden' ||
        typeof window.fbq !== 'function') return;
    contentSent = true;
    window.fbq('trackSingle', pixel, 'ViewContent');
  }

  window.UmbralTracking = Object.freeze({ preserveUrl, initiateCheckout });

  function prepareLink(link) {
    if (!link || !link.getAttribute('href')) return false;
    let current;
    try { current = new URL(link.href, document.baseURI); }
    catch (_) { return false; }
    if (!originals.has(link)) {
      if (!isCheckout(current)) return false;
      originals.set(link, current.href);
    }
    const base = new URL(originals.get(link));
    current.searchParams.forEach((item, key) => {
      if (!base.searchParams.has(key)) base.searchParams.set(key, item);
    });
    const result = preserveUrl(base.href);
    if (link.getAttribute('href') !== result) link.setAttribute('href', result);
    return true;
  }

  function scan(root) {
    if (root.matches && root.matches('a[href]')) prepareLink(root);
    if (root.querySelectorAll) root.querySelectorAll('a[href]').forEach(prepareLink);
  }

  ['pointerdown', 'contextmenu', 'click', 'auxclick'].forEach(type => {
    document.addEventListener(type, event => {
      const element = event.target instanceof Element ? event.target : event.target.parentElement;
      const link = element && element.closest('a[href]');
      if (!prepareLink(link)) return;
      if ((type === 'click' && event.button === 0) ||
          (type === 'auxclick' && event.button === 1)) initiateCheckout();
    }, true);
  });

  let offerObserved = false;
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    if (entries.some(item => item.isIntersecting)) {
      viewContent();
      if (contentSent) observer.disconnect();
    }
  }) : null;
  function findOffer() {
    if (contentSent) return;
    const premium = document.getElementById('premium-plan');
    const offer = premium && premium.closest('section');
    if (!offer) return;
    if (observer && !offerObserved) { observer.observe(offer); offerObserved = true; }
    const rect = offer.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0 && rect.bottom > 0 &&
        rect.top < innerHeight) viewContent();
  }
  function start() {
    scan(document);
    findOffer();
    new MutationObserver(records => {
      records.forEach(record => {
        if (record.type === 'attributes') prepareLink(record.target);
        else record.addedNodes.forEach(scan);
      });
      findOffer();
    }).observe(document.documentElement, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['href']
    });
    window.addEventListener('scroll', findOffer, { passive: true });
    window.addEventListener('resize', findOffer, { passive: true });
    document.addEventListener('visibilitychange', findOffer);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
