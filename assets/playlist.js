/* Renders a YouTube-style playlist into <div class="yt-pl" data-playlist="name">. */
(function () {
  var BASE = 'https://fliimedia.github.io/Flii.nl/assets/playlists/';

  function build(host, data) {
    var vids = (data.videos || []).filter(function (v) { return v && v.id; });
    if (!vids.length) { host.remove(); return; }

    var grid = document.createElement('div');
    grid.className = 'yt-pl-grid';

    var stage = document.createElement('div');
    stage.className = 'yt-pl-stage';
    var frame = document.createElement('iframe');
    frame.setAttribute('allow', 'accelerometer; encrypted-media; picture-in-picture; fullscreen');
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('loading', 'lazy');
    frame.setAttribute('title', data.title || 'Video');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + vids[0].id + '?rel=0';
    stage.appendChild(frame);

    var side = document.createElement('div');
    side.className = 'yt-pl-side';
    side.innerHTML =
      '<div class="yt-pl-head"><span class="yt-pl-title"></span>' +
      '<span class="yt-pl-count"></span></div><div class="yt-pl-list"></div>' +
      '<div class="yt-pl-foot"><a target="_blank" rel="noopener">Bekijk op YouTube &rarr;</a></div>';
    side.querySelector('.yt-pl-title').textContent = data.title || '';
    side.querySelector('.yt-pl-count').textContent = vids.length + ' video\u2019s';
    var foot = side.querySelector('.yt-pl-foot a');
    foot.href = 'https://www.youtube.com/playlist?list=' + data.playlist;

    var list = side.querySelector('.yt-pl-list');
    var buttons = [];

    vids.forEach(function (v, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'yt-pl-item';
      b.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      b.innerHTML =
        '<span class="yt-pl-idx">' + (i + 1) + '</span>' +
        '<img class="yt-pl-thumb" loading="lazy" alt="" src="https://i.ytimg.com/vi/' +
        v.id + '/mqdefault.jpg">' +
        '<span class="yt-pl-name"></span>';
      b.querySelector('.yt-pl-name').textContent = v.title || 'Video ' + (i + 1);
      b.addEventListener('click', function () {
        frame.src = 'https://www.youtube-nocookie.com/embed/' + v.id + '?rel=0&autoplay=1';
        buttons.forEach(function (x) { x.setAttribute('aria-current', 'false'); });
        b.setAttribute('aria-current', 'true');
      });
      buttons.push(b);
      list.appendChild(b);
    });

    grid.appendChild(stage);
    grid.appendChild(side);
    host.appendChild(grid);
  }

  function init() {
    [].forEach.call(document.querySelectorAll('.yt-pl[data-playlist]'), function (host) {
      if (host.dataset.done === '1') return;
      host.dataset.done = '1';
      fetch(BASE + host.getAttribute('data-playlist') + '.json')
        .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
        .then(function (d) { build(host, d); })
        .catch(function () { host.remove(); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
