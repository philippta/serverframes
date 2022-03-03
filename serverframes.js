(function () {
  function update(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    Array.from(doc.body.children).map((fragment) => {
      document.getElementById(fragment.id).outerHTML = fragment.outerHTML;
    });
    attach();
  }

  function xfetch(method, url, body) {
    return fetch(url, { method, body, headers: { "X-Serverframes": "true" } })
      .then((res) => {
        if (res.redirected) {
          window.location.href = res.url;
        }
        return res.text();
      })
      .then(update);
  }

  function attachTo(selector, callback) {
    const attr = "serverframes-attached";
    document.querySelectorAll(selector).forEach((el) => {
      if (!el.hasAttribute(attr)) {
        el.setAttribute(attr, "");
        callback(el);
      }
    });
  }

  function attach() {
    attachTo("[serverframes]", (el) => {
      if (el instanceof HTMLFormElement) {
        el.addEventListener("submit", (e) => {
          e.preventDefault();
          data = new FormData(el);
          if (e.submitter && e.submitter.hasAttribute("name")) {
            data.append(e.submitter.getAttribute("name"), e.submitter.value);
          }
          xfetch(
            el.getAttribute("method") || "GET",
            el.getAttribute("action") || window.location.href,
            data
          );
        });
      } else if (el instanceof HTMLAnchorElement) {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          xfetch("GET", el.getAttribute("href"));
        });
      }
    });
  }
  attach();
})();
