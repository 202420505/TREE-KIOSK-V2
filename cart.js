const cart = document.getElementById("cart-list");
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
const auth = firebase.auth();
const db = firebase.firestore();

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    const description = urlParams.get('description');
    const image = urlParams.get('image');
    const price = parseFloat(urlParams.get('price'));
    const quantity = parseInt(urlParams.get('quantity'));

    if (itemId && description && image && !isNaN(price) && !isNaN(quantity)) {

        addItemToOrder({ id: itemId, image, description, price , quantity });
        saveOrder(); // Save order to localStorage
        window.close();
        }
    cartshow();
}

window.addEventListener('load', init);

const cartshow = debounce(function () {
    renderCart();
}, 300);

function renderCart() {
    cart.innerHTML = order.length === 0 ? `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>장바구니가 비어있습니다.</div>
        </li>` : order.map((item, index) => `
        <li class="list-group-item d-flex justify-content-between align-items-center item cart">
            <img src="${item.image}" alt="${item.description}">
            <span class="info">${item.description}</span>
            <div class="input-group mb-3">
                <input type="number" min="1" value="${item.quantity}" id="${index}" class="form-control" placeholder="quantity">
                <button type="button" class="btn btn-outline-danger" onclick="deleteItem(${index})">삭제</button>
            </div>
        </li>
    `).join('');

    order.forEach((item, index) => {
        document.getElementById(index).addEventListener("change", debounce(event => {
            updateItemQuantity(item.description, parseInt(event.target.value));
        }, 300));
    });
}

function updateItemQuantity(description, newQuantity) {
    const itemIndex = getItemIndex(description);
    if (itemIndex !== -1 && newQuantity > 0) {
        const originalPrice = order[itemIndex].price / order[itemIndex].quantity;
        order[itemIndex].quantity = newQuantity;
        order[itemIndex].price = newQuantity * originalPrice;
        console.log('Updated Order:', order); // Debugging: Log updated order
        saveOrder(); // Save order to localStorage
        renderCart(); // 카트 화면을 새로 고침
    }
}

function saveOrder() {
    localStorage.setItem('order', JSON.stringify(order));
}

function deleteItem(index) {
    order.splice(index, 1);
    saveOrder(); // Save order to localStorage after deletion
    cartshow();
    console.log('Deleted Item:', order); // Debugging: Log current order
}

function addItemToOrder({ id, image, description, price, quantity }) {
    const existingIndex = getItemIndex(description);
    if (existingIndex !== -1) {
        order[existingIndex].quantity += quantity;
        order[existingIndex].price += quantity * (price / quantity);
    } else {
        order.push({ id, image, description, quantity, price });
    }
    console.log('Current Order:', order); // Debugging: Log current order
}

function getItemIndex(description) {
    return order.findIndex(item => item.description === description);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function openwindow(name) {
    var url = `${name}`;
    var win = window.open(url, '_blank');
    win.focus();
  }
  


  
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
