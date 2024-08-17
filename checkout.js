const li = document.getElementById("check");
let order = JSON.parse(localStorage.getItem('order')) || []; // Load from localStorage or initialize


const firebaseConfig = {
    apiKey: "AIzaSyDruA1fSmRQqM-xDgJhgu9KKVGWj8GpuKQ",
    authDomain: "tree-kiosk-system-v2.firebaseapp.com",
    databaseURL: "https://tree-kiosk-system-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tree-kiosk-system-v2",
    storageBucket: "tree-kiosk-system-v2.appspot.com",
    messagingSenderId: "719927565453",
    appId: "1:719927565453:web:caa088914a03dcb2e896c4"
  };

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

function renderCheckout() {
  li.innerHTML = '';
  if (order.length === 0) {
      li.innerHTML = `<li class="list-group-item d-flex justify-content-between align-items-center">
            <div>장바구니가 비어있습니다.</div>
        </li>`;
  } else {
      order.forEach((item, index) => {
          li.innerHTML += `
              <li class="list-group-item d-flex justify-content-between align-items-center">
                  <img src="${item.image}" alt="${item.description}" class="item-img">
                  <div>
                      <span>${item.description}</span>
                      <span>Quantity: ${item.quantity}</span>
                      <span>Price: ${item.price}</span>
                  </div>
              </li>
          `;
      });
  }
}
  

  window.addEventListener('load', renderCheckout);


  function appendNumber(num) {
    var input = document.getElementById('numberDisplay');
    if (input.value.length < 13) { // 최대 길이 13 (010-0000-0000)
        input.value = formatPhoneNumber(input.value + num);
    }
    toggleSendButton();
}

function clearDisplay() {
    var input = document.getElementById('numberDisplay');
    input.value = '010-';
    toggleSendButton();
}

function backspace() {
    var input = document.getElementById('numberDisplay');
    if (input.value.length > 4) { // "010-"는 지우지 않음
        input.value = formatPhoneNumber(input.value.slice(0, -1));
    }
    toggleSendButton();
}

function toggleSendButton() {
    var input = document.getElementById('numberDisplay');
    var sendButton = document.getElementById('sendButton');
    if (input.value.length === 13) { // 010-0000-0000
        sendButton.style.display = 'block';
    } else {
        sendButton.style.display = 'none';
    }
}

function submit() {
  var input = document.getElementById('numberDisplay').value;
  var postListRef = firebase.database().ref("people/");
  var newPostRef = postListRef.child(input).push();
  newPostRef
    .set({  
      number: input,
      order: order
    }) .then(() => { 
    clearDisplay();
    localStorage.removeItem("order");

    alert("완료 되었습니다.");
    window.opener.postMessage("home", window.location.origin);

    window.close();
}).catch((error) => {
    console.error("Error appending data: ", error);
  });
}

function formatPhoneNumber(value) {
    value = value.replace(/[^0-9]/g, ''); // Remove all non-digit characters
    if (value.length > 3) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    }
    if (value.length > 8) {
        value = value.slice(0, 8) + '-' + value.slice(8, 12);
    }
    return value;
}

function cert() {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.display = page.id === "certificate" ? 'block' : 'none';
  });
  
}

const auth = firebase.auth();


auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User is signed in:', user.email);
        localStorage.setItem('user', user.email);
        show('front', 'login-container');
    } else {
  location.href = "index.html"  
  }
  });