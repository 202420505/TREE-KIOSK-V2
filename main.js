const ul = document.getElementById("list");

window.addEventListener('load', function () {
  switchPage('main');
});

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