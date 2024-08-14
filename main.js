const ul = document.getElementById("list");

window.addEventListener('load', init);

function init() {
  home();
    if (ul && ul.innerHTML.trim() === '') {
      loaditem();
    }
  }


function loaditem() {
  fetch("/image/file.json")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    let dataMarkup = '';

    for (key in data) {
      dataMarkup += display(data[key], key);
    }

    ul.innerHTML = dataMarkup; 
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}


function display(child,key) {

  return `
 <li class="list-group-item d-flex justify-content-between align-items-center item">
      <img class="lazyload"src="${child.image}" 
           alt="${child.name}" 
           data-id="${key}" 
           onclick="edit(event)">
      <span class="info">${child.name}</span>
    </li>
  `;
}

function edit(event) {
  const id = event.target.dataset.id;
  window.location.href = `add.html?item=${encodeURIComponent(id)}`;
}



function switchPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.display = page.id === pageId ? 'block' : 'none';
  });
}


function home() {
  switchPage('main');
}
