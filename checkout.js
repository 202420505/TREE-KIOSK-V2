const li = document.getElementById("check");
let order = JSON.parse(localStorage.getItem('order')) || []; // Load from localStorage or initialize
var shop =  localStorage.getItem('name').replace(/"/g, '');

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
const db = firebase.firestore();

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
    // Firestore와 Realtime Database의 참조를 각각 설정합니다.
    var shopRef = db.collection('data').doc('shop').collection(`${shop}`).doc("numbers");

    // localStorage에서 'order'를 가져와 JSON으로 파싱합니다.
    var order = JSON.parse(localStorage.getItem("order"));

    var input = document.getElementById('numberDisplay').value;

    // Realtime Database에서 데이터 참조 설정
    var numref = firebase.database().ref(`number/${shop}`);
    var postListRef = firebase.database().ref(`people/`);

    let shopValue;

    // Realtime Database에서 데이터를 가져옵니다.
    numref.once('value')
    .then((snapshot) => {
        shopValue = snapshot.val();

        // 'people/2호점' 경로에 데이터를 제출합니다.
        return postListRef.push({  
            number: input,
            order: order  
        });
    })
    .then(() => {
        // Use 'set' with 'merge: true' to create the document if it doesn't exist
        return shopRef.set({
            regions: firebase.firestore.FieldValue.arrayUnion(shopValue)
        }, { merge: true });
    })
    .then(() => {
        // '2호점' 값을 증가시킵니다.
        return numref.transaction((currentValue) => {
            return (currentValue || 0) + 1;
        });
    })
    .then(() => { 
        // 성공 후 처리
        clearDisplay();
        localStorage.removeItem("order");

        alert("완료 되었습니다.");
        window.opener.postMessage("home", window.location.origin);

        window.close();
    })
    .catch((error) => {
        console.error("Error during submission: ", error);
        alert("Error during submission: " + error.message);
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
