// Variable global input
var valueName;
var valuePrice;
var valueAvatar;
// Jquery link header, footer, home
window.onload = function (e) {
  loadHeader();
  loadHome();
  loadFooter();
  renderListProduct();
  checkPath();
  checkIsLogin();
};
// Load header.html to header tag in index.html
function loadHeader() {
  $.get("./routing/header.html", function (data, status) {
    $("header").html(data);
  });
}
function loadHome() {
  $.get("./routing/home.html", function (list, status) {
    $("main").html(list);
  });
}
function loadFooter() {
  $.get("./routing/footer.html", function (list, status) {
    $("footer").html(list);
  });
}
// GET API to render UI
function renderListProduct() {
  let url = "https://636d3e1c91576e19e323dd40.mockapi.io/api/v1/users";
  fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((list) => _renderListToUL(list));
}
function _renderListToUL(list) {
  let ulElement = document.querySelector(".list-product");
  ulElement.innerHTML = list.map((phone) => cardPhone(phone));
}

// refresh code to Card of Phone
function cardPhone(phone) {
  return `
  <li>
        <div class="card" style="width: 18rem; padding:20px 0">
          <img src="${phone.avatar}" class="card-img-top" alt="..." style="padding: 20px" />
          <div class="card-body">
            <h5 class="card-title">${phone.name}</h5>
            <p >${phone.price}</p>
            <p class="card-text">
              Some quick example text to build on the card title and make up
              the bulk of the card's content.
            </p>
            <button  onclick="handleBuyProduct(${phone.id})" class="btn btn-primary">Mua hàng</button>
          </div>
        </div>
      </li>
  `;
}
// function handle buy product (Click Mua hàng)
function handleBuyProduct(idPhone) {
  let url =
    "https://636d3e1c91576e19e323dd40.mockapi.io/api/v1/users/" + idPhone;
  fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((phone) => handleFormBuyProduct(phone));
}

// Render form buy and sell for user when click Mua Hang
function handleFormBuyProduct(phone) {
  let mainContent = document.querySelector("main");
  mainContent.innerHTML = "";
  mainContent.innerHTML = renderDetailProduct(
    phone.name,
    phone.avatar,
    phone.price
  );
  mainContent.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}
// Handle CRUD of product
function handleListProduct() {
  // render form add product
  $.get("./routing/form.html", function (data, status) {
    $("main").html(data);
  });
  document
    .querySelector("main")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}
// Add new product to API when click "Submit" in form.html
function handleAddProduct() {
  let namePhone = document.getElementById("namePhone");
  let pricePhone = document.getElementById("pricePhone");
  let avatarPhone = document.getElementById("avatarPhone");
  data = {
    name: namePhone.value,
    price: pricePhone.value,
    avatar: avatarPhone.value,
  };
  let url = "https://636d3e1c91576e19e323dd40.mockapi.io/api/v1/users";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((newList) => _renderSubmitForm(namePhone, pricePhone, avatarPhone));
}
// re-render input form when click SUBMIT in form.html
function _renderSubmitForm(namePhone, pricePhone, avatarPhone) {
  namePhone.value = "";
  pricePhone.value = "";
  avatarPhone.value = "";
  setTimeout(function () {
    document.querySelector(".toast").classList.add("show");
  }, 500);
}
// function handle click Danh sách sản phẩm in form.html
// render list product to handle RUD
function handleRUDProduct() {
  $.get("./routing/list.html", function (data, status) {
    $("main").html(data);
  });
  _handleProductToTable();
}
function _handleProductToTable() {
  let url = "https://636d3e1c91576e19e323dd40.mockapi.io/api/v1/users";
  fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((list) => _renderProductToTable(list));
}
function _renderProductToTable(products) {
  let tbody = document.getElementsByTagName("tbody")[0];
  tbody.innerHTML = products.map((product) => {
    return `
    <tr>
    <th scope="row">${product.id}</th>
    <td>${product.name}</td>
    <td>${product.price}</td>
    <td>${product.avatar}</td>
    <td><button class="updateBtn" onclick="handleUpdate(${product.id})">Update</button></td>
    <td><button class="deleteBtn" onclick="handleDelete(${product.id})">Delete</button></td>
  </tr>
    `;
  });
}

// UPDATE
// function handle update when click button update in form
function handleUpdate(idProduct) {
  let url =
    "https://636d3e1c91576e19e323dd40.mockapi.io/api/v1/users/" + idProduct;
  let trTag = document
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("tr")[idProduct - 1];
  // Get name phone form API into input when update
  // GET td name, price, avatar
  let tdName = trTag.getElementsByTagName("td")[0];
  let tdPrice = trTag.getElementsByTagName("td")[1];
  let tdAvatar = trTag.getElementsByTagName("td")[2];
  let inputName = `<input style="width:150px;text-align:center" type='text' id='nameProduct'><br>`;
  let inputPrice = `<input style="width:100px; text-align:center" type='text' id='namePrice'><br>`;
  let inputAvatar = `<input style="width:550px" type='text' id='nameAvatar'><br>`;
  tdName.innerHTML = inputName;
  tdPrice.innerHTML = inputPrice;
  tdAvatar.innerHTML = inputAvatar;
  fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => getValueGlobal(data, tdName, tdPrice, tdAvatar));
}

// Put value into input element
function getValueGlobal(phone, tdName, tdPrice, tdAvatar) {
  let inputOldName = tdName.getElementsByTagName("input")[0];
  let inputOldPrice = tdPrice.getElementsByTagName("input")[0];
  let inputOldAvatar = tdAvatar.getElementsByTagName("input")[0];
  inputOldName.value = phone.name;
  inputOldPrice.value = phone.price;
  inputOldAvatar.value = phone.avatar;
  // Onblur input name
  inputOldName.onblur = function () {
    data = {
      name: this.value,
      price: inputOldPrice.value,
      avatar: inputOldAvatar.value,
    };
    let url =
      "https://636d3e1c91576e19e323dd40.mockapi.io/api/v1/users/" + phone.id;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => changeInputToTdName(tdName, data));
  };
  // Onblur input price
  inputOldPrice.onblur = function () {
    data = {
      name: inputOldName.value,
      price: this.value,
      avatar: inputOldAvatar.value,
    };
    let url =
      "https://636d3e1c91576e19e323dd40.mockapi.io/api/v1/users/" + phone.id;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => changeInputToTdPrice(tdPrice, data));
  };
  inputOldAvatar.onblur = function () {
    data = {
      name: inputOldName.value,
      price: inputOldPrice.value,
      avatar: inputOldAvatar.value,
    };
    let url =
      "https://636d3e1c91576e19e323dd40.mockapi.io/api/v1/users/" + phone.id;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => changeInputToTdAvatar(tdAvatar, data));
  };
}
function changeInputToTdName(tdName, data) {
  tdName.innerText = data.name;
}
function changeInputToTdPrice(tdPrice, data) {
  tdPrice.innerText = data.price;
}
function changeInputToTdAvatar(tdAvatar, data) {
  tdAvatar.innerText = data.avatar;
}
// DELETE
function handleDelete(idProduct) {
  let url =
    "https://636d3e1c91576e19e323dd40.mockapi.io/api/v1/users/" + idProduct;
  fetch(url, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => handleRUDProduct());
}
// Validator form
function Validate(options) {
  var formElement = document.querySelector(options.form);
  options.rules.forEach(function (rule) {
    var inputElement = formElement.querySelector(rule.selector);
    // Xu li su kien khi nhap thi tat canh bao
    inputElement.oninput = function () {
      inputElement.parentElement.querySelector(".form-message").innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    };
    // Xu li su kien khi tro chuot ra ngoai thi hien canh bao
    inputElement.onblur = function () {
      var errorMessage = rule.test(inputElement.value);
      if (errorMessage) {
        inputElement.parentElement.querySelector(".form-message").innerText =
          errorMessage;
        inputElement.parentElement.classList.add("invalid");
      } else {
        inputElement.parentElement.querySelector(".form-message").innerText =
          errorMessage;
        inputElement.parentElement.classList.remove("invalid");
      }
    };
  });
}
Validate.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      if (value) {
        return value.trim() ? "" : "Bạn phải nhập vào trường này";
      } else {
        return "Mời bạn nhập tên đăng nhập.";
      }
    },
  };
};
Validate.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (value) {
        return regex.test(value) ? "" : "Bạn phải nhập đúng email.";
      } else {
        return "Bạn chưa nhập email.";
      }
    },
  };
};
Validate.isPassword = function (selector, min) {
  return {
    selector: selector,
    test: function (value) {
      if (value) {
        return value.length >= min ? "" : "Bạn phải nhập 6 kí tự trở lên.";
      } else {
        return "Bạn chưa nhập mật khẩu.";
      }
    },
  };
};
Validate.confirmPassword = function (selector, getPasswordValue) {
  return {
    selector: selector,
    test: function (value) {
      if (value) {
        return value === getPasswordValue() ? "" : "Mật khẩu không chính xác.";
      } else {
        return "Bạn cần xác minh mật khẩu";
      }
    },
  };
};

// Feature LoGin
function checkIsLogin() {
  let url = new URL(window.location.href);
  let isLogin = url.searchParams.get("islogin");
  let isLogin2 = localStorage.getItem("islogin");
}
function checkPath() {
  const PATH_NAME = window.location.href;
  console.log("HREF", PATH_NAME);

  let js = document.querySelectorAll("a");
  let listItemNav = $("a");
  for (let index = 0; index < listItemNav.length; index++) {
    const element = listItemNav[index];
    if (PATH_NAME === element.href) {
      $(element).addClass("active text-danger");
    }
  }
}
function handleLogInUser() {
  window.location.href =
    "http://127.0.0.1:5500/HTML_CSS/Layout/TheGioiDiDong/routing/form-login.html";
}

// Render detail phone when click Mua hang
function renderDetailProduct(name, avatar, price) {
  return `
  <div style="margin-top: 100px" class="container">
      <div class="row">
        <div class="col-sm">
          <h4 style="margin-bottom: 40px">
            <strong id="title-name">Điện thoại ${name}</strong>
          </h4>
          <img
            style="width: 80%"
            src="${avatar}"
            alt=""
          />
        </div>
        <div class="col-sm">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th colspan="2" scope="col">Cấu hình Điện thoại ${name}</th>
              </tr>
            </thead>
            <tbody>
            <tr>
                  <th scope="row">Giá:</th>
                  <td>${price}</td>
                </tr>
              <tr>
                <th scope="row">Màn hình:</th>
                <td>IPS LCD, 6.1"Liquid Retina</td>
              </tr>
              <tr>
                <th scope="row">Hệ điều hành:</th>
                <td>iOS 16</td>
              </tr>
              <tr>
                <th scope="row">Camera sau:</th>
                <td>2 camera 12 MP</td>
              </tr>
              <tr>
                <th scope="row">Camera trước:</th>
                <td>12 MP</td>
              </tr>
              <tr>
                <th scope="row">Chip:</th>
                <td>Apple A13 Bionic</td>
              </tr>
              <tr>
                <th scope="row">Ram:</th>
                <td>4 GB</td>
              </tr>
              <tr>
                <th scope="row">Dung lượng lưu trữ:</th>
                <td>64 GB</td>
              </tr>
              <tr>
                <th scope="row">Pin, Sạc:</th>
                <td>3110 mAh, 18 W</td>
              </tr>
            </tbody>
          </table>
          <button
            type="button"
            class="btn btn-primary"
            data-toggle="button"
            aria-pressed="false"
            autocomplete="off"
          >
            Mua hàng
          </button>
        </div>
      </div>
    </div>
  `;
}
