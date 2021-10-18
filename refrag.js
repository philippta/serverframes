(function () {
  function update(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    Array.from(doc.body.children).map((fragment) => {
      document.getElementById(fragment.id).outerHTML = fragment.outerHTML;
    });
    attach();
  }

  function xfetch(method, url, body) {
    return fetch(url, { method, body })
      .then((res) => {
        if (res.redirected) {
          window.location.href = res.url;
        }
        return res.text();
      })
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
            el.getAttribute("method") || "GET",
            el.getAttribute("action") || window.location.href,
            new FormData(el)
          );
        });
      } else if (el instanceof HTMLAnchorElement) {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          xfetch("GET", el.getAttribute("href"));
        });
      } else {
        console.warn("x-intercept can only be set on: form, a");
      }
    });
  }
  attach();
})();
