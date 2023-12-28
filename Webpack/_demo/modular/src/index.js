import sum from './sum';

function component() {
  const element = document.createElement('button');

  element.innerHTML = 'Hello webpack';

  element.addEventListener('click', ()=> {
    console.log('click');
    console.log(sum(1,2));
  })

  return element;
}

document.body.appendChild(component());