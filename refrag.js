(function () {
  function update(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("[x-fragment]").forEach((fragment) => {
      const name = fragment.getAttribute("x-fragment");
      document.querySelector(`[x-fragment="${name}"]`).outerHTML =
        fragment.outerHTML;
    });
    attach();
  }

  function xfetch(method, url, body) {
    return fetch(url, { method, body })
      .then((res) => res.text())
      .then(update);
  }

  function attachTo(selector, callback) {
    document.querySelectorAll(selector).forEach((el) => {
      if (el.hasAttribute("x-attached")) {
        return;
      }
      el.setAttribute("x-attached", "");
      callback(el);
    });
  }

  function attach() {
    attachTo("[x-intercept]", (el) => {
      if (el instanceof HTMLFormElement) {
        el.addEventListener("submit", (e) => {
          e.preventDefault();
          xfetch(
            el.getAttribute("method"),
            el.getAttribute("action"),
            new FormData(el)
          );
        });
      } else if (el instanceof HTMLAnchorElement) {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          xfetch(el.getAttribute("x-method") || "GET", el.getAttribute("href"));
        });
      } else {
        console.warn("x-intercept can only be set on: form, a");
      }
    });
  }
  attach();
})();
