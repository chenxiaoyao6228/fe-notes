(() => {
  "use strict";
  document.body.appendChild(
    (function () {
      const e = document.createElement("button");
      return (
        (e.innerHTML = "Hello webpack"),
        e.addEventListener("click", () => {
          console.log(Number(Math.random().toFixed(1)) + 2);
        }),
        e
      );
    })()
  );
})();
