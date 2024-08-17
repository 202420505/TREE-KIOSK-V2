
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('item');

    if (itemId) {
      const decodedItemId = decodeURIComponent(itemId);
      fetch("image/file.json")
.then(res => res.json())
.then(data => {

  var item = data[decodedItemId];


  const form = document.getElementById("select");
          form.innerHTML = `
            <img src="${item.image}" alt="${item.name}" data-id="${decodedItemId}"><br>
            <span class="info">${item.name}</span><br><br>
            <div class="input-group flex-nowrap">
              <button type="button" class="btn btn-outline-danger" onclick="decreaseQuantity()">-</button>
              <input type="number" id="quantity" value="1" min="1" max="5" class="form-control"/>
              <button type="button" class="btn btn-outline-success" onclick="increaseQuantity()">+</button>
            </div>
            <br>
            <button type="submit" class="btn btn-outline-success">확인</button>
            <button type="reset" class="btn btn-outline-warning">취소</button>
          `;

          form.dataset.id = decodedItemId;
          form.dataset.description = item.name;
          form.dataset.image = item.image;
          form.dataset.price = item.price;
          form.addEventListener("submit", handleSubmit);
          form.addEventListener("reset", resetForm);
}
)
          
        } else {
          console.error('Item not found');
        }    
       }

  function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  }

  function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    let currentValue = parseInt(quantityInput.value);
    if (currentValue < 5) {
      quantityInput.value = currentValue + 1;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const itemId = form.dataset.id;
    const description = form.dataset.description;
    const image = form.dataset.image;
    const price = form.dataset.price;
    const quantity = document.getElementById("quantity").value;

    const urlParams = new URLSearchParams({
      id: itemId,
      description: description,
      image: image,
      price: price,
      quantity: quantity
    });

    window.location.href = `cart.html?${urlParams.toString()}`;
  }

  function resetForm(event) {
    event.preventDefault();
    const form = event.target;
    form.querySelector('#quantity').value = 1;
    window.close();
  }

  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  
  auth.onAuthStateChanged(user => {
    if (!user) {
  location.href = "index.html"  
  }
  });