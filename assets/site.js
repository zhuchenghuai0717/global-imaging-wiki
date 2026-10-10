/* 站点交互：仅提供「复制微信号」一个功能。
   无框架、无依赖，避免为单一点击引入运行时。 */
(function () {
  "use strict";

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }
    // 非安全上下文（如 file:// 本地预览）的回退路径
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var state = document.getElementById(btn.getAttribute("data-copy-state") || "");

    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy") || "";
      var idle = btn.getAttribute("data-label-idle") || btn.textContent.trim();
      var done = btn.getAttribute("data-label-done") || "已复制";

      copyText(value).then(
        function () {
          btn.textContent = done;
          if (state) state.textContent = "微信号已复制：" + value;
          window.setTimeout(function () {
            btn.textContent = idle;
          }, 2000);
        },
        function () {
          btn.textContent = "请手动复制";
          if (state) state.textContent = "自动复制不可用，请手动选中微信号复制。";
        }
      );
    });
  });
})();
