/* =============================================
   TEXTILCRAFT - MAIN JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function () {
      preloader.classList.add('hidden');
      setTimeout(function () {
        preloader.style.display = 'none';
      }, 500);
    });
    // Fallback: hide preloader after 3 seconds
    setTimeout(function () {
      preloader.classList.add('hidden');
      setTimeout(function () {
        preloader.style.display = 'none';
      }, 500);
    }, 3000);
  }

  /* ---------- Header Scroll Effect ---------- */
  const header = document.getElementById('header');
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      // Only remove scrolled on homepage (hero exists)
      var hero = document.getElementById('hero');
      if (hero) {
        header.classList.remove('scrolled');
      }
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  /* ---------- Mobile Menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu on link click
    var links = navLinks.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    }

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  /* ---------- Back to Top ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll Animations ---------- */
  function animateOnScroll() {
    var elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var rect = el.getBoundingClientRect();
      var windowHeight = window.innerHeight;
      if (rect.top < windowHeight - 80) {
        el.classList.add('visible');
      }
    }
  }
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run on load

  /* ---------- Counter Animation ---------- */
  function animateCounters() {
    var counters = document.querySelectorAll('.stat-number[data-count]');
    for (var i = 0; i < counters.length; i++) {
      var counter = counters[i];
      var rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight && !counter.classList.contains('counted')) {
        counter.classList.add('counted');
        var target = parseInt(counter.getAttribute('data-count'), 10);
        var current = 0;
        var increment = target / 60;
        var duration = 2000;
        var stepTime = duration / 60;

        (function (el, tgt, inc, step) {
          var cur = 0;
          var timer = setInterval(function () {
            cur += inc;
            if (cur >= tgt) {
              el.textContent = tgt.toLocaleString('tr-TR') + '+';
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(cur).toLocaleString('tr-TR');
            }
          }, step);
        })(counter, target, increment, stepTime);
      }
    }
  }
  window.addEventListener('scroll', animateCounters);
  animateCounters();

  /* ---------- Product Filter ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var productCards = document.querySelectorAll('.product-card');

  for (var i = 0; i < filterBtns.length; i++) {
    filterBtns[i].addEventListener('click', function () {
      // Remove active class from all
      for (var j = 0; j < filterBtns.length; j++) {
        filterBtns[j].classList.remove('active');
      }
      this.classList.add('active');

      var filter = this.getAttribute('data-filter');

      for (var k = 0; k < productCards.length; k++) {
        var card = productCards[k];
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout((function (c) {
            return function () {
              c.style.opacity = '1';
              c.style.transform = 'translateY(0)';
              c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            };
          })(card), 50);
        } else {
          card.style.display = 'none';
        }
      }

      // Update result count
      updateResultCount(filter);
    });
  }

  function updateResultCount(filter) {
    var resultCount = document.querySelector('.result-count');
    if (!resultCount) return;
    var visibleCount = 0;
    for (var i = 0; i < productCards.length; i++) {
      if (productCards[i].style.display !== 'none') {
        visibleCount++;
      }
    }
    resultCount.innerHTML = 'Toplam <strong>' + visibleCount + '</strong> ürün gösteriliyor';
  }

  /* ---------- Product Sort ---------- */
  var sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      var grid = document.querySelector('.products-page-grid') || document.querySelector('.products-grid');
      if (!grid) return;

      var cards = Array.prototype.slice.call(grid.querySelectorAll('.product-card'));
      var sortValue = this.value;

      cards.sort(function (a, b) {
        switch (sortValue) {
          case 'price-low':
            return parseFloat(a.getAttribute('data-price') || 0) - parseFloat(b.getAttribute('data-price') || 0);
          case 'price-high':
            return parseFloat(b.getAttribute('data-price') || 0) - parseFloat(a.getAttribute('data-price') || 0);
          case 'name':
            return (a.getAttribute('data-name') || '').localeCompare(b.getAttribute('data-name') || '', 'tr');
          default:
            return 0;
        }
      });

      for (var i = 0; i < cards.length; i++) {
        grid.appendChild(cards[i]);
      }
    });
  }

  /* ---------- Shopping Cart ---------- */
  var cart = JSON.parse(localStorage.getItem('textilcraft_cart') || '[]');

  var cartToggle = document.getElementById('cartToggle');
  var cartSidebar = document.getElementById('cartSidebar');
  var cartOverlay = document.getElementById('cartOverlay');
  var cartClose = document.getElementById('cartClose');
  var cartItems = document.getElementById('cartItems');
  var cartCount = document.getElementById('cartCount');
  var cartItemCount = document.getElementById('cartItemCount');
  var cartTotal = document.getElementById('cartTotal');

  function openCart() {
    if (cartSidebar) cartSidebar.classList.add('active');
    if (cartOverlay) cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (cartOverlay) cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartToggle) {
    cartToggle.addEventListener('click', function (e) {
      e.preventDefault();
      openCart();
    });
  }

  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  function updateCartUI() {
    var totalItems = 0;
    var totalPrice = 0;

    for (var i = 0; i < cart.length; i++) {
      totalItems += cart[i].qty;
      totalPrice += cart[i].price * cart[i].qty;
    }

    if (cartCount) cartCount.textContent = totalItems;
    if (cartItemCount) cartItemCount.textContent = totalItems;
    if (cartTotal) cartTotal.textContent = '₺' + totalPrice.toFixed(2);

    if (!cartItems) return;

    if (cart.length === 0) {
      cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Sepetiniz boş</p></div>';
      return;
    }

    var html = '';
    for (var j = 0; j < cart.length; j++) {
      var item = cart[j];
      html += '<div class="cart-item" data-index="' + j + '">' +
        '<img src="' + item.img + '" alt="' + item.name + '">' +
        '<div class="cart-item-info">' +
        '<h4>' + item.name + '</h4>' +
        '<p class="cart-item-price">₺' + item.price.toFixed(2) + '</p>' +
        '<div class="cart-item-qty">' +
        '<button class="qty-decrease" data-index="' + j + '">-</button>' +
        '<span>' + item.qty + '</span>' +
        '<button class="qty-increase" data-index="' + j + '">+</button>' +
        '</div></div>' +
        '<button class="cart-item-remove" data-index="' + j + '"><i class="fas fa-trash-alt"></i></button>' +
        '</div>';
    }
    cartItems.innerHTML = html;

    // Add event listeners for qty buttons
    var decreaseBtns = cartItems.querySelectorAll('.qty-decrease');
    var increaseBtns = cartItems.querySelectorAll('.qty-increase');
    var removeBtns = cartItems.querySelectorAll('.cart-item-remove');

    for (var d = 0; d < decreaseBtns.length; d++) {
      decreaseBtns[d].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        if (cart[idx].qty > 1) {
          cart[idx].qty--;
        } else {
          cart.splice(idx, 1);
        }
        saveCart();
        updateCartUI();
      });
    }

    for (var inc = 0; inc < increaseBtns.length; inc++) {
      increaseBtns[inc].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        cart[idx].qty++;
        saveCart();
        updateCartUI();
      });
    }

    for (var r = 0; r < removeBtns.length; r++) {
      removeBtns[r].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'), 10);
        cart.splice(idx, 1);
        saveCart();
        updateCartUI();
      });
    }
  }

  function saveCart() {
    localStorage.setItem('textilcraft_cart', JSON.stringify(cart));
  }

  function addToCart(name, price, img) {
    // Check if item already exists
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].name === name) {
        cart[i].qty++;
        saveCart();
        updateCartUI();
        openCart();
        showNotification(name + ' sepete eklendi!');
        return;
      }
    }
    cart.push({ name: name, price: parseFloat(price), img: img, qty: 1 });
    saveCart();
    updateCartUI();
    openCart();
    showNotification(name + ' sepete eklendi!');
  }

  // Add to cart buttons
  var addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  for (var a = 0; a < addToCartBtns.length; a++) {
    addToCartBtns[a].addEventListener('click', function () {
      var name = this.getAttribute('data-name');
      var price = this.getAttribute('data-price');
      var img = this.getAttribute('data-img');
      addToCart(name, price, img);
    });
  }

  // Initialize cart UI
  updateCartUI();

  /* ---------- Wishlist Toggle ---------- */
  var wishlistBtns = document.querySelectorAll('.wishlist-btn');
  for (var w = 0; w < wishlistBtns.length; w++) {
    wishlistBtns[w].addEventListener('click', function () {
      this.classList.toggle('active');
      var icon = this.querySelector('i');
      if (this.classList.contains('active')) {
        icon.style.color = '#e74c3c';
        showNotification('Favorilere eklendi!');
      } else {
        icon.style.color = '';
        showNotification('Favorilerden çıkarıldı.');
      }
    });
  }

  /* ---------- Notification Toast ---------- */
  function showNotification(message) {
    // Remove existing notifications
    var existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = 'position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(100px); ' +
      'background: #1a1a2e; color: white; padding: 15px 30px; border-radius: 8px; z-index: 99999; ' +
      'font-family: "Poppins", sans-serif; font-size: 0.9rem; box-shadow: 0 5px 20px rgba(0,0,0,0.2); ' +
      'transition: transform 0.4s ease; display: flex; align-items: center; gap: 10px;';
    toast.innerHTML = '<i class="fas fa-check-circle" style="color: #c9a96e;"></i>' + message;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 50);

    setTimeout(function () {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(function () {
        toast.remove();
      }, 400);
    }, 3000);
  }

  /* ---------- Newsletter Form ---------- */
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = this.querySelector('input[type="email"]').value;
      if (email) {
        showNotification('Bültenimize başarıyla abone oldunuz!');
        this.reset();
      }
    });
  }

  /* ---------- Contact Form ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      var firstName = document.getElementById('firstName');
      var lastName = document.getElementById('lastName');
      var email = document.getElementById('email');
      var subject = document.getElementById('subject');
      var message = document.getElementById('message');

      if (!firstName.value || !lastName.value || !email.value || !subject.value || !message.value) {
        showNotification('Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      // Email validation
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        showNotification('Lütfen geçerli bir e-posta adresi girin.');
        return;
      }

      showNotification('Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız.');
      this.reset();
    });
  }

  /* ---------- FAQ Toggle ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  for (var f = 0; f < faqItems.length; f++) {
    faqItems[f].addEventListener('click', function () {
      var answer = this.querySelector('.faq-answer');
      var icon = this.querySelector('.fa-chevron-down');
      var isOpen = this.classList.contains('open');

      // Close all
      for (var g = 0; g < faqItems.length; g++) {
        faqItems[g].classList.remove('open');
        var ans = faqItems[g].querySelector('.faq-answer');
        var ic = faqItems[g].querySelector('.fa-chevron-down');
        if (ans) ans.style.maxHeight = '0';
        if (ic) ic.style.transform = 'rotate(0deg)';
      }

      // Open current if was closed
      if (!isOpen) {
        this.classList.add('open');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  }

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  for (var s = 0; s < anchorLinks.length; s++) {
    anchorLinks[s].addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  }

  /* ---------- Lazy Load Images ---------- */
  if ('IntersectionObserver' in window) {
    var imgObserver = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          var img = entries[i].target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      }
    }, { rootMargin: '100px' });

    var lazyImages = document.querySelectorAll('img[data-src]');
    for (var li = 0; li < lazyImages.length; li++) {
      imgObserver.observe(lazyImages[li]);
    }
  }

  /* ---------- Quick View Modal ---------- */
  var quickViewBtns = document.querySelectorAll('.quick-view-btn');
  var quickViewModal = document.getElementById('quickViewModal');
  var quickViewOverlay = document.getElementById('quickViewOverlay');
  var quickViewClose = document.getElementById('quickViewClose');

  function openQuickView(card) {
    if (!quickViewModal) return;
    var img = card.querySelector('.product-image img');
    var name = card.querySelector('.product-info h3 a').textContent;
    var category = card.querySelector('.product-category').textContent;
    var priceEl = card.querySelector('.product-price .current');
    var oldPriceEl = card.querySelector('.product-price .old');
    var ratingEl = card.querySelector('.product-rating');
    var addBtn = card.querySelector('.add-to-cart-btn');

    var modalImg = quickViewModal.querySelector('.modal-image img');
    var modalName = quickViewModal.querySelector('.modal-details h2');
    var modalCategory = quickViewModal.querySelector('.modal-category');
    var modalPrice = quickViewModal.querySelector('.modal-price .current');
    var modalOldPrice = quickViewModal.querySelector('.modal-price .old');
    var modalRating = quickViewModal.querySelector('.modal-rating');
    var modalAddBtn = quickViewModal.querySelector('.modal-add-to-cart');

    if (modalImg) modalImg.src = img.src.replace('w=400&h=400', 'w=600&h=600');
    if (modalImg) modalImg.alt = name;
    if (modalName) modalName.textContent = name;
    if (modalCategory) modalCategory.textContent = category;
    if (modalPrice && priceEl) modalPrice.textContent = priceEl.textContent;
    if (modalOldPrice) {
      if (oldPriceEl) {
        modalOldPrice.textContent = oldPriceEl.textContent;
        modalOldPrice.style.display = '';
      } else {
        modalOldPrice.textContent = '';
        modalOldPrice.style.display = 'none';
      }
    }
    if (modalRating && ratingEl) modalRating.innerHTML = ratingEl.innerHTML;
    if (modalAddBtn && addBtn) {
      modalAddBtn.setAttribute('data-name', addBtn.getAttribute('data-name'));
      modalAddBtn.setAttribute('data-price', addBtn.getAttribute('data-price'));
      modalAddBtn.setAttribute('data-img', addBtn.getAttribute('data-img'));
    }

    // Reset qty
    var qtyInput = quickViewModal.querySelector('.qty-value');
    if (qtyInput) qtyInput.textContent = '1';

    quickViewModal.classList.add('active');
    if (quickViewOverlay) quickViewOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    if (quickViewModal) quickViewModal.classList.remove('active');
    if (quickViewOverlay) quickViewOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  for (var qv = 0; qv < quickViewBtns.length; qv++) {
    quickViewBtns[qv].addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var card = this.closest('.product-card');
      if (card) openQuickView(card);
    });
  }

  if (quickViewClose) quickViewClose.addEventListener('click', closeQuickView);
  if (quickViewOverlay) quickViewOverlay.addEventListener('click', closeQuickView);
  if (quickViewModal) {
    quickViewModal.addEventListener('click', function (e) {
      if (e.target === quickViewModal) closeQuickView();
    });
  }

  // Modal qty controls
  if (quickViewModal) {
    var qtyMinus = quickViewModal.querySelector('.qty-minus');
    var qtyPlus = quickViewModal.querySelector('.qty-plus');
    var qtyVal = quickViewModal.querySelector('.qty-value');

    if (qtyMinus) {
      qtyMinus.addEventListener('click', function () {
        var val = parseInt(qtyVal.textContent, 10);
        if (val > 1) qtyVal.textContent = val - 1;
      });
    }
    if (qtyPlus) {
      qtyPlus.addEventListener('click', function () {
        var val = parseInt(qtyVal.textContent, 10);
        qtyVal.textContent = val + 1;
      });
    }

    var modalAddBtn = quickViewModal.querySelector('.modal-add-to-cart');
    if (modalAddBtn) {
      modalAddBtn.addEventListener('click', function () {
        var name = this.getAttribute('data-name');
        var price = this.getAttribute('data-price');
        var img = this.getAttribute('data-img');
        var qty = parseInt(qtyVal.textContent, 10) || 1;
        for (var q = 0; q < qty; q++) {
          addToCart(name, price, img);
        }
        closeQuickView();
      });
    }
  }

  /* ---------- Search Overlay ---------- */
  var searchToggle = document.getElementById('searchToggle');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchClose = document.getElementById('searchClose');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');

  var allProducts = [
    { name: 'Organik Pamuk Kumaş', category: 'Pamuk', price: '189.90', img: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=100&h=100&fit=crop' },
    { name: 'Saf İpek Saten', category: 'İpek', price: '459.90', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=100&h=100&fit=crop' },
    { name: 'Premium Keten', category: 'Keten', price: '279.90', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=100&h=100&fit=crop' },
    { name: 'Merinos Yünü', category: 'Yün', price: '349.90', img: 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=100&h=100&fit=crop' },
    { name: 'Denim Kumaş', category: 'Pamuk', price: '159.90', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop' },
    { name: 'İpek Şifon', category: 'İpek', price: '389.90', img: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=100&h=100&fit=crop' },
    { name: 'Fransız Keteni', category: 'Keten', price: '329.90', img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=100&h=100&fit=crop' },
    { name: 'Kaşmir Yünü', category: 'Yün', price: '599.90', img: 'https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=100&h=100&fit=crop' },
    { name: 'Polyester Krep', category: 'Polyester', price: '129.90', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100&h=100&fit=crop' },
    { name: 'Gabardin Kumaş', category: 'Pamuk', price: '219.90', img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=100&h=100&fit=crop' },
    { name: 'Dupion İpek', category: 'İpek', price: '529.90', img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&h=100&fit=crop' },
    { name: 'Scuba Kumaş', category: 'Polyester', price: '149.90', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop' }
  ];

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      if (searchInput) searchInput.focus();
    }, 300);
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', function (e) {
      e.preventDefault();
      openSearch();
    });
  }

  if (searchClose) searchClose.addEventListener('click', closeSearch);

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var query = this.value.toLocaleLowerCase('tr-TR').trim();
      if (!searchResults) return;

      if (query.length < 2) {
        searchResults.innerHTML = '<p class="search-hint">Aramak için en az 2 karakter yazın...</p>';
        return;
      }

      var results = allProducts.filter(function (p) {
        var pName = p.name.toLocaleLowerCase('tr-TR');
        var pCat = p.category.toLocaleLowerCase('tr-TR');
        var q = query.toLocaleLowerCase('tr-TR');
        return pName.indexOf(q) !== -1 || pCat.indexOf(q) !== -1;
      });

      if (results.length === 0) {
        searchResults.innerHTML = '<p class="search-no-result">Sonuç bulunamadı. Farklı bir arama terimi deneyin.</p>';
        return;
      }

      var html = '';
      for (var i = 0; i < results.length; i++) {
        var p = results[i];
        html += '<div class="search-result-item">' +
          '<img src="' + p.img + '" alt="' + p.name + '">' +
          '<div class="search-result-info">' +
          '<h4>' + p.name + '</h4>' +
          '<p>' + p.category + '</p>' +
          '<span class="search-result-price">₺' + p.price + '</span>' +
          '</div>' +
          '<button class="btn btn-primary search-add-cart" data-name="' + p.name + '" data-price="' + p.price + '" data-img="' + p.img + '">Sepete Ekle</button>' +
          '</div>';
      }
      searchResults.innerHTML = html;

      // Add event listeners to search result cart buttons
      var searchCartBtns = searchResults.querySelectorAll('.search-add-cart');
      for (var sc = 0; sc < searchCartBtns.length; sc++) {
        searchCartBtns[sc].addEventListener('click', function () {
          addToCart(this.getAttribute('data-name'), this.getAttribute('data-price'), this.getAttribute('data-img'));
          closeSearch();
        });
      }
    });
  }

  /* ---------- Pagination ---------- */
  var paginationLinks = document.querySelectorAll('.pagination a');
  if (paginationLinks.length > 0) {
    var productsPerPage = 12;
    var allProductCards = document.querySelectorAll('.products-page-grid .product-card');
    var currentPage = 1;
    var totalPages = Math.ceil(allProductCards.length / productsPerPage) || 1;

    function showPage(page) {
      currentPage = page;
      var start = (page - 1) * productsPerPage;
      var end = start + productsPerPage;

      for (var i = 0; i < allProductCards.length; i++) {
        if (i >= start && i < end) {
          allProductCards[i].style.display = '';
          allProductCards[i].style.opacity = '0';
          allProductCards[i].style.transform = 'translateY(20px)';
          setTimeout((function (c) {
            return function () {
              c.style.opacity = '1';
              c.style.transform = 'translateY(0)';
              c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            };
          })(allProductCards[i]), 50);
        } else {
          allProductCards[i].style.display = 'none';
        }
      }

      // Update active class on pagination
      for (var j = 0; j < paginationLinks.length; j++) {
        paginationLinks[j].classList.remove('active');
      }
      // Find the clicked page number link
      for (var k = 0; k < paginationLinks.length; k++) {
        if (paginationLinks[k].textContent.trim() === String(page)) {
          paginationLinks[k].classList.add('active');
        }
      }

      // Update result count
      var visibleCount = 0;
      for (var v = 0; v < allProductCards.length; v++) {
        if (allProductCards[v].style.display !== 'none') visibleCount++;
      }
      var resultCount = document.querySelector('.result-count');
      if (resultCount) {
        resultCount.innerHTML = 'Toplam <strong>' + visibleCount + '</strong> / ' + allProductCards.length + ' ürün gösteriliyor';
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    for (var pg = 0; pg < paginationLinks.length; pg++) {
      paginationLinks[pg].addEventListener('click', function (e) {
        e.preventDefault();
        var text = this.textContent.trim();
        var icon = this.querySelector('i');
        if (icon) {
          // Next/prev arrow
          if (icon.classList.contains('fa-chevron-right') && currentPage < totalPages) {
            showPage(currentPage + 1);
          } else if (icon.classList.contains('fa-chevron-left') && currentPage > 1) {
            showPage(currentPage - 1);
          }
        } else {
          var pageNum = parseInt(text, 10);
          if (!isNaN(pageNum)) showPage(pageNum);
        }
      });
    }
  }

  /* ---------- URL Filter Parameter ---------- */
  var urlParams = new URLSearchParams(window.location.search);
  var filterParam = urlParams.get('filter');
  if (filterParam && filterBtns.length > 0) {
    for (var fp = 0; fp < filterBtns.length; fp++) {
      if (filterBtns[fp].getAttribute('data-filter') === filterParam) {
        filterBtns[fp].click();
        break;
      }
    }
  }

  /* ---------- Checkout Button ---------- */
  var checkoutBtns = document.querySelectorAll('.cart-footer .btn-primary');
  for (var cb = 0; cb < checkoutBtns.length; cb++) {
    checkoutBtns[cb].addEventListener('click', function (e) {
      e.preventDefault();
      if (cart.length === 0) {
        showNotification('Sepetiniz boş! Lütfen ürün ekleyin.');
        return;
      }
      closeCart();
      window.location.href = 'checkout.html';
    });
  }

  /* ---------- Keyboard Accessibility ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeCart();
      closeQuickView();
      closeSearch();
    }
  });

});
