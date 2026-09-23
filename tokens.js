/*
 * tokens.js - a token counter that only ever goes up.
 *
 * The count is a pure function of unix time, so it needs no storage, reads the
 * same on every device, and survives reloads without ticking backwards:
 *
 *   count(t) = BASE + elapsed * RATE + jitter(elapsed)
 *
 * jitter is a smooth random walk seeded from the clock itself, so the counter
 * visibly speeds up and slows down instead of marching at a constant pace.
 * It stays monotonic by construction: jitter is piecewise-linear between
 * hashed samples one WINDOW apart, so its slope is bounded by AMP / WINDOW.
 * With AMP = RATE * WINDOW / 2, that slope can never fall below -RATE/2,
 * leaving total growth somewhere in [RATE/2, 3*RATE/2] - always positive.
 */
(function (root) {
  // when the counting starts: 2023-03-14, claude's first public release
  var EPOCH = Date.UTC(2023, 2, 14) / 1000;

  var BASE = 42e12;   // tokens already burned before the clock started
  var RATE = 2.4e6;   // tokens per second, averaged, all day every day
  var WINDOW = 90;    // seconds between jitter samples
  var AMP = RATE * WINDOW / 2; // keeps |jitter slope| <= RATE/2

  // xorshift-ish hash: an integer -> a stable number in [0, 1)
  function hash(n) {
    var x = (n | 0) ^ 0x5f3759df;
    x ^= x << 13; x |= 0;
    x ^= x >>> 17;
    x ^= x << 5; x |= 0;
    return ((x >>> 0) % 100000) / 100000;
  }

  // smooth, deterministic wobble in [0, AMP)
  function jitter(elapsed) {
    var k = Math.floor(elapsed / WINDOW);
    var f = elapsed / WINDOW - k;
    var a = hash(k);
    var b = hash(k + 1);
    return AMP * (a + (b - a) * f);
  }

  // tokens used as of unix timestamp `seconds` (defaults to now)
  function tokensUsed(seconds) {
    var now = seconds === undefined ? Date.now() / 1000 : seconds;
    var elapsed = Math.max(0, now - EPOCH);
    return Math.floor(BASE + elapsed * RATE + jitter(elapsed));
  }

  function format(n) {
    return n.toLocaleString('en-US');
  }

  // paint the count into [data-token-count] and keep it climbing.
  // repaints every animation frame rather than on an interval, so the digits
  // sweep like a mechanical watch hand instead of stepping like a quartz one.
  function mount(el) {
    var node = el || document.querySelector('[data-token-count]');
    if (!node) return;
    var last = '';
    var sweep = function () {
      var next = format(tokensUsed());
      if (next !== last) { node.textContent = next; last = next; }
      requestAnimationFrame(sweep);
    };
    sweep();
  }

  root.tokenCounter = { tokensUsed: tokensUsed, format: format, mount: mount };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { mount(); });
    } else {
      mount();
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
