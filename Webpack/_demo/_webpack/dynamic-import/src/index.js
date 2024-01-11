
const minus = require('./minus');

function component() {
  const element = document.createElement('button');

  element.innerHTML = 'Hello webpack';

  element.addEventListener('click', ()=> {
    
    import('./sum').then(({default: sum}) => {
      console.log(sum(1,2));
    })

    console.log(minus(1,2));
  })

  return element;
}

document.body.appendChild(component());