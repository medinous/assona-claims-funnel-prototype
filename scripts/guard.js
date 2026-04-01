(function () {
  var SESSION_KEY = 'assona_proto_auth';
  var PASSWORD = 'assonadesign2026';

  // Already authenticated in this session — do nothing
  if (sessionStorage.getItem(SESSION_KEY) === '1') return;

  // Block page scroll while modal is open
  document.documentElement.style.overflow = 'hidden';

  // Inject overlay + modal into the DOM immediately
  var overlay = document.createElement('div');
  overlay.id = 'assona-guard-overlay';
  overlay.innerHTML = [
    '<div id="assona-guard-modal">',
    '  <div class="guard-logo">',
    '    <img src="images/logo/assona-simple_black.svg" alt="Assona" />',
    '  </div>',
    '  <div class="guard-heading">',
    '    <p class="guard-title">Prototype access</p>',
    '    <p class="guard-sub">This prototype is password protected. Enter the access password to continue.</p>',
    '  </div>',
    '  <div class="guard-field">',
    '    <label class="guard-label" for="assona-guard-input">Password</label>',
    '    <input id="assona-guard-input" type="password" placeholder="Enter password" autocomplete="current-password" />',
    '    <span id="assona-guard-error">Incorrect password. Please try again.</span>',
    '  </div>',
    '  <button id="assona-guard-submit" type="button">Continue</button>',
    '</div>',
  ].join('');

  // Wait for <body> to exist (script runs in <head>)
  function mount() {
    document.body.appendChild(overlay);
    var input = document.getElementById('assona-guard-input');
    var btn = document.getElementById('assona-guard-submit');
    var err = document.getElementById('assona-guard-error');

    function attempt() {
      if (input.value === PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, '1');
        document.documentElement.style.overflow = '';
        overlay.remove();
      } else {
        input.classList.add('guard-input-error');
        err.classList.add('visible');
        input.focus();
      }
    }

    btn.addEventListener('click', attempt);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') attempt();
      // Clear error state on new input
      input.classList.remove('guard-input-error');
      err.classList.remove('visible');
    });

    input.focus();
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
})();
