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

  /* ---------- Keyboard Accessibility ---------- */
  document.addEventListener('keydown', function (e) {
    // Close cart with Escape
    if (e.key === 'Escape') {
      closeCart();
    }
  });

});
