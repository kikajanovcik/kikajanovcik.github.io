(function () {
  var root = document.documentElement;
  if (!root.classList.contains("from-landing")) return;

  var settle = function () {
    root.classList.add("is-settled");
    window.setTimeout(function () {
      root.classList.add("is-open");
    }, 1650);
  };

  requestAnimationFrame(function () {
    requestAnimationFrame(settle);
  });
  window.setTimeout(settle, 50);
})();
