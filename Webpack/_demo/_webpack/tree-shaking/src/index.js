import { sum } from "./math";

function component() {
  const element = document.createElement("button");
  element.innerHTML = "Hello webpack";
  element.addEventListener("click", () => {
    console.log(sum(Number(Math.random().toFixed(1)), 2));
  });

  return element;
}

document.body.appendChild(component());
