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
        let ul = document.querySelector('ul');
        ul.innerHTML = ''; // 기존 내용을 초기화
  
        for (let key in data) {
          const listItem = display(data[key], key);
          ul.appendChild(listItem);
        }
  
        // 이미지를 미리 로드
        let images = document.querySelectorAll(".lazyload");
        fastLazyLoad(images);
      });
  }
  
  function display(child, key) {
    const li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center item";
  
    const img = document.createElement('img');
    img.className = "lazyload";
    img.alt = child.name;
    img.dataset.id = key;
    img.src = child.placeholder || 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBA=='; // 작은 placeholder 이미지
  
    img.dataset.src = child.image;  // 실제 이미지는 나중에 로드
    img.dataset.srcset = `${child.imageSmall} 320w, ${child.image} 640w`; // 다양한 해상도 지원
  
    img.loading = 'lazy';
    img.onclick = edit; // 편집 기능 연결
  
    const span = document.createElement('span');
    span.className = "info";
    span.textContent = child.name;
  
    li.appendChild(img);
    li.appendChild(span);
  
    return li;
  }
  
  // 최적화된 LazyLoad 함수
  function fastLazyLoad(images) {
    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          preloadImage(entry.target);
          self.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px', // 관찰할 여백 설정
      threshold: 0.1 // 어느 정도 보였을 때 로드할지 설정
    });
  
    images.forEach(image => observer.observe(image));
  }
  
  function preloadImage(img) {
    const src = img.dataset.src;
    if (src) {
      img.src = src; // 실제 이미지 로드
    }
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset; // 고해상도 디스플레이 지원
    }
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
