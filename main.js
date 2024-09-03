
  // Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDruA1fSmRQqM-xDgJhgu9KKVGWj8GpuKQ",
    authDomain: "tree-kiosk-system-v2.firebaseapp.com",
    databaseURL: "https://tree-kiosk-system-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tree-kiosk-system-v2",
    storageBucket: "tree-kiosk-system-v2.appspot.com",
    messagingSenderId: "719927565453",
    appId: "1:719927565453:web:caa088914a03dcb2e896c4"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


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
    ul.innerHTML = ''; // Clear existing content

    for (let key in data) {
      const listItem = display(data[key], key);
      ul.appendChild(listItem);
    }

    // Preload images using lazy loading
    let images = document.querySelectorAll(".lazyload");
    fastLazyLoad(images);
  })
  .catch(error => {
    console.error("Error fetching data:", error);
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
var url = `add.html?item=${encodeURIComponent(id)}`;
openwindow(url)
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

function openwindow(name) {
var url = `${name}`;
var win = window.open(url, '_blank');
win.focus();
}



window.addEventListener("message", function(event) {
// 메시지의 출처 확인 (도메인이 동일한지 확인)
if (event.origin !== window.location.origin) {
    return;
}
if(event.data === "home") {
window.location.href = `index.html`;
}
});



auth.onAuthStateChanged(user => {
  if (!user) {
location.href = "index.html"  
}
});


async function setlocal(email) {
  console.log("Email being used to fetch document:", email);  // 이메일 확인용 로그 추가

  const docRef = db.collection("data").doc("owner").collection("email").doc(email);

  docRef.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());  // 문서 데이터 확인용 로그 추가
          const name = doc.data().name;
          const isActive = doc.data().active;

          if (isActive !== false) {
              localStorage.setItem("name", name);
              localStorage.setItem("email", email);
          } else {
          location.href = "index.html"
          }
      } else {
        location.href = "index.html"
      }
  }).catch((error) => {
      location.href = "index.html"
  });
}

document.addEventListener("DOMContentLoaded", function() {
var email = localStorage.getItem('email');
setlocal(email);
});



window.addEventListener("message", function(event) {
// 메시지의 출처 확인 (도메인이 동일한지 확인)
if (event.origin !== window.location.origin) {
    return;
}
if(event.data === "home") {
window.location.href = `index.html`;
}
});