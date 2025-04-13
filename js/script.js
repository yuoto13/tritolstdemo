// Данные меню
const menuData = [
    {
      id: 1,
      title: "Пицца Маргарита",
      description: "Томатный соус, моцарелла, свежий базилик",
      price: 399,
      image: "/api/placeholder/400/320",
      category: "pizza"
    },
    {
      id: 2,
      title: "Бургер Классический",
      description: "Говяжья котлета, сыр, салат, томаты, соус",
      price: 299,
      image: "/api/placeholder/400/320",
      category: "burger"
    },
    {
      id: 3,
      title: "Сет Калифорния",
      description: "32 кусочка, филадельфия, калифорния, унаги",
      price: 1299,
      image: "/api/placeholder/400/320",
      category: "sushi"
    },
    {
      id: 4,
      title: "Паста Карбонара",
      description: "Сливочный соус, бекон, пармезан",
      price: 399,
      image: "/api/placeholder/400/320",
      category: "pasta"
    },
    {
      id: 5,
      title: "Чизкейк Нью-Йорк",
      description: "Классический чизкейк с ягодным соусом",
      price: 249,
      image: "/api/placeholder/400/320",
      category: "dessert"
    },
    {
      id: 6,
      title: "Пицца Пепперони",
      description: "Томатный соус, моцарелла, пепперони",
      price: 449,
      image: "/api/placeholder/400/320",
      category: "pizza"
    },
    {
      id: 7,
      title: "Бургер Двойной",
      description: "Две говяжьи котлеты, двойной сыр, бекон",
      price: 399,
      image: "/api/placeholder/400/320",
      category: "burger"
    },
    {
      id: 8,
      title: "Ролл Филадельфия",
      description: "Лосось, сливочный сыр, огурец, авокадо",
      price: 399,
      image: "/api/placeholder/400/320",
      category: "sushi"
    }
  ];
  
  // DOM элементы
  const menuGrid = document.getElementById("menu-grid");
  const cartIcon = document.getElementById("cart-icon");
  const cartModal = document.getElementById("cart-modal");
  const closeCart = document.getElementById("close-cart");
  const overlay = document.getElementById("overlay");
  const cartItems = document.getElementById("cart-items");
  const cartCountElement = document.getElementById("cart-count");
  const cartTotalElement = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  
  // Элементы для модальной формы заказа
  const orderFormModal = document.getElementById("order-form-modal");
  const closeOrderForm = document.getElementById("close-order-form");
  const orderForm = document.getElementById("order-form");
  
  // Элементы для модального окна успешного заказа
  const successModal = document.getElementById("success-modal");
  const successBtn = document.getElementById("success-btn");
  
  const categories = document.querySelectorAll(".category");
  
  // Корзина
  let cart = [];
  
  // Инициализация
  function init() {
    renderMenu("all");
    setupEventListeners();
  }
  
  // Функция отрисовки меню
  function renderMenu(category) {
    menuGrid.innerHTML = "";
    const filteredMenu = category === "all"
      ? menuData
      : menuData.filter(item => item.category === category);
  
    filteredMenu.forEach((item, index) => {
      const delay = index * 0.1;
      const menuItem = document.createElement("div");
      menuItem.className = "menu-item";
      menuItem.style.animationDelay = `${delay}s`;
      menuItem.innerHTML = `
        <div class="menu-item-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="menu-item-info">
          <h3 class="menu-item-title">${item.title}</h3>
          <p class="menu-item-description">${item.description}</p>
          <div class="menu-item-bottom">
            <div class="menu-item-price">${item.price} ₽</div>
            <button class="add-to-cart" data-id="${item.id}">+</button>
          </div>
        </div>
      `;
      menuGrid.appendChild(menuItem);
    });
  
    // Назначение обработчиков для кнопок "Добавить в корзину"
    document.querySelectorAll(".add-to-cart").forEach(button => {
      button.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        addToCart(id);
        e.target.classList.add("bounce");
        setTimeout(() => {
          e.target.classList.remove("bounce");
        }, 500);
      });
    });
  }
  
  // Функция добавления товара в корзину
  function addToCart(id) {
    const item = menuData.find(item => item.id === id);
    if (!item) return;
    const existingItem = cart.find(cartItem => cartItem.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    updateCart();
  }
  
  // Обновление корзины: счетчик, итоговая сумма и отрисовка списка товаров
  function updateCart() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartCountElement.textContent = cartCount;
    cartCountElement.classList.add("bounce");
    setTimeout(() => {
      cartCountElement.classList.remove("bounce");
    }, 500);
    cartTotalElement.textContent = `${cartTotal} ₽`;
    checkoutBtn.disabled = cart.length === 0;
    renderCartItems();
  }
  
  // Отрисовка товаров в корзине
  function renderCartItems() {
    if (cart.length === 0) {
      cartItems.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
      return;
    }
    cartItems.innerHTML = "";
    cart.forEach(item => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${item.price} ₽ x ${item.quantity}</div>
          <div class="cart-item-controls">
            <button class="quantity-btn" data-id="${item.id}" data-action="decrement">-</button>
            <span class="cart-item-quantity">${item.quantity}</span>
            <button class="quantity-btn" data-id="${item.id}" data-action="increment">+</button>
          </div>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });
  
    document.querySelectorAll(".quantity-btn").forEach(button => {
      button.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        const action = e.target.getAttribute("data-action");
        updateItemQuantity(id, action);
      });
    });
  }
  
  // Изменение количества товара в корзине
  function updateItemQuantity(id, action) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    if (action === "increment") {
      item.quantity += 1;
    } else if (action === "decrement") {
      item.quantity = Math.max(1, item.quantity - 1);
    }
    updateCart();
  }
  
  // Функция открытия модального окна
  function openModal(modal) {
    overlay.classList.add("active");
    if (modal === successModal) {
      modal.classList.add("active");
    } else {
      modal.classList.add("open");
    }
  }
  
  // Функция закрытия модального окна
  function closeModal(modal, isSuccess = false) {
    overlay.classList.remove("active");
    if (isSuccess) {
      modal.classList.remove("active");
    } else {
      modal.classList.remove("open");
    }
  }
  
  // Обработчики событий
  function setupEventListeners() {
    // Обработка нажатия на иконку корзины
    cartIcon.addEventListener("click", () => {
      openModal(cartModal);
    });
  
    // Закрыть корзину
    closeCart.addEventListener("click", () => {
      closeModal(cartModal);
    });
  
    // Обработка клика по оверлею – закрываются все модальные окна
    overlay.addEventListener("click", () => {
      closeModal(cartModal);
      closeModal(orderFormModal);
      closeModal(successModal, true);
    });
  
    // При нажатии на кнопку "Оформить заказ" – открывается форма заказа, если корзина не пустая
    checkoutBtn.addEventListener("click", () => {
      if (cart.length > 0) {
        closeModal(cartModal);
        openModal(orderFormModal);
      }
    });
  
    // Закрытие окна формы заказа
    closeOrderForm.addEventListener("click", () => {
      closeModal(orderFormModal);
    });
  
    // Отправка формы заказа
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Здесь можно добавить дополнительную валидацию формы
      submitOrder();
    });
  
    // Кнопка "Продолжить покупки" после успешного заказа
    successBtn.addEventListener("click", () => {
      closeModal(successModal, true);
    });
  
    // Фильтрация по категориям
    categories.forEach(category => {
      category.addEventListener("click", () => {
        categories.forEach(c => c.classList.remove("active"));
        category.classList.add("active");
        renderMenu(category.getAttribute("data-category"));
      });
    });
  }
  
  // Отправка заказа с формой
  function submitOrder() {
    // Чтение значений из формы
    const name = document.getElementById("customer-name").value;
    const phone = document.getElementById("customer-phone").value;
    const street = document.getElementById("street").value;
    const house = document.getElementById("house").value;
    const entrance = document.getElementById("entrance").value;
    const apartment = document.getElementById("apartment").value;
    const comment = document.getElementById("comment").value;
    const isCashless = document.getElementById("payment-method").checked;
  
    // Формирование адреса
    const address = `${street}, д. ${house}, подъезд ${entrance}, кв. ${apartment}`;
  
    // Пример отправки данных (можно заменить на AJAX-запрос)
    console.log("Заказ отправлен:", {
      name,
      phone,
      address,
      comment,
      isCashless,
      cart
    });
  
    // После отправки заказа закрываем форму, очищаем корзину
    closeModal(orderFormModal);
    cart = [];
    updateCart();
  
    // Показываем модальное окно успешного заказа с небольшой задержкой для анимации
    setTimeout(() => {
      openModal(successModal);
    }, 300);
  }
  
  // Запуск инициализации после загрузки страницы
  document.addEventListener("DOMContentLoaded", init);
  