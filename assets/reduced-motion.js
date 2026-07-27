/* Reduced-motion support that CSS alone cannot cover:
   JS-driven marquee, autoplaying video and the letter animation. */
(function () {
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (!mq) return;

  function apply(on) {
    document.documentElement.setAttribute('data-reduced-motion', on ? 'true' : 'false');
    window.__reducedMotion = on;
    if (!on) return;

    // Stop any looping/background video and show a static frame.
    [].forEach.call(document.querySelectorAll('video'), function (v) {
      try {
        v.autoplay = false;
        v.removeAttribute('autoplay');
        v.pause();
        if (!v.hasAttribute('controls')) v.setAttribute('controls', '');
      } catch (e) {}
    });

    // Park the marquee at its current offset.
    var row = document.querySelector('.clients-row');
    if (row) row.style.transform = 'none';
  }

  apply(mq.matches);
  if (mq.addEventListener) mq.addEventListener('change', function (e) { apply(e.matches); });
  else if (mq.addListener) mq.addListener(function (e) { apply(e.matches); });
})();
