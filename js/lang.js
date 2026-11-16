/*
 * Language routing for the Motion Cam website.
 * - index.html / privacy-policy.html are the English pages.
 * - On a first visit to an English page, visitors whose browser prefers Korean
 *   are sent to the Korean page automatically.
 * - Once a visitor picks a language with the switcher, that choice is remembered
 *   and no automatic redirect happens again.
 * Each page sets <html data-page="home|privacy" data-lang="en|ko">.
 */
(function () {
  var KEY = 'motioncam-lang';
  var PAGES = {
    home: { en: 'index.html', ko: 'index-ko.html' },
    privacy: { en: 'privacy-policy.html', ko: 'privacy-policy-ko.html' }
  };
  var SUPPORTED = ['en', 'ko'];

  var root = document.documentElement;
  var page = root.getAttribute('data-page');
  var lang = root.getAttribute('data-lang');
  if (!PAGES[page]) return;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* storage blocked: ignore */ }
  }
  function browserLang() {
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i]).toLowerCase().slice(0, 2);
      if (SUPPORTED.indexOf(code) !== -1) return code;
    }
    return 'en';
  }

  // Only the English (default) page redirects, and only when the visitor hasn't chosen a language.
  var explicit = /[?&]lang=/.test(location.search);
  if (lang === 'en' && !explicit) {
    var wanted = saved() || browserLang();
    if (wanted !== 'en' && PAGES[page][wanted]) {
      location.replace(PAGES[page][wanted] + location.hash);
      return;
    }
  }

  // Remember the language the visitor picks in the switcher.
  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('[data-set-lang]') : null;
    if (link) save(link.getAttribute('data-set-lang'));
  });
})();
