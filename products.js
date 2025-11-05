document.addEventListener('DOMContentLoaded', () => {
  // ===== CATEGORY BUTTONS =====
  const viewMenBtn = document.getElementById('view-men-shoes-btn');
  const viewWomenBtn = document.getElementById('view-women-shoes-btn');
  const viewKiddiesBtn = document.getElementById('view-kiddies-shoes-btn');
  const viewHomeEssentialsBtn = document.getElementById('view-home-essentials-btn');

  const menProducts = document.getElementById('men-product-list');
  const womenProducts = document.getElementById('women-product-list');
  const kiddiesProducts = document.getElementById('kiddies-product-list');
  const homeEssentialsProducts = document.getElementById('home-essentials-product-list');

  const menFilters = document.getElementById('men-filters');
  const womenFilters = document.getElementById('women-filters');
  const kiddiesFilters = document.getElementById('kiddies-filters');
  const homeEssentialsFilters = document.getElementById('home-essentials-filters');

  let activeCategory = null;
  let allProducts = [];

  // ===== FETCH PRODUCTS =====
  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      allProducts = products;
      displayProducts(products, menProducts, 'men');
      displayProducts(products, womenProducts, 'women');
      displayProducts(products, kiddiesProducts, 'kiddies');
      displayProducts(products, homeEssentialsProducts, 'home-essentials');
    })
    .catch(err => console.error('Error loading products.json:', err));

  // ===== DISPLAY PRODUCTS =====
  function displayProducts(products, container, categoryType) {
    container.innerHTML = '';

    const filtered = products.filter(p => p.category === categoryType);
    if (!filtered.length) {
      container.innerHTML = '<p>No products found.</p>';
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.dataset.id = product.id;
      card.dataset.type = product.type;

      // Add image, name, price
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>R${product.price}</p>
      `;

      // Create dropdown wrapper
      const dropdownWrapper = document.createElement('div');
      dropdownWrapper.className = 'dropdowns-wrapper';

      // Add top "Select" label
      const topLabel = document.createElement('div');
      topLabel.className = 'dropdown-top-label';
      topLabel.textContent = 'Select';
      dropdownWrapper.appendChild(topLabel);

      // Container for actual dropdowns
      const selectsContainer = document.createElement('div');
      selectsContainer.className = 'dropdown-selects';

      const createDropdown = (options, placeholder, className) => {
        const select = document.createElement('select');
        select.className = className;

        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.textContent = placeholder;
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        select.appendChild(placeholderOption);

        options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          select.appendChild(option);
        });

        return select;
      };

      // Size dropdown
      if (Array.isArray(product.sizes) && product.sizes.length) {
        selectsContainer.appendChild(createDropdown(product.sizes, 'Size', 'size-select'));
      }

      // Color dropdown
      if (Array.isArray(product.colors) && product.colors.length) {
        selectsContainer.appendChild(createDropdown(product.colors, 'Color', 'color-select'));
      }

      if (selectsContainer.children.length > 0) {
        dropdownWrapper.appendChild(selectsContainer);
        card.appendChild(dropdownWrapper);
      }

      // Add to Cart button
      const addBtn = document.createElement('button');
      addBtn.className = 'btn-add';
      addBtn.textContent = 'Add to Cart';
      addBtn.disabled = true;
      card.appendChild(addBtn);

      container.appendChild(card);
    });
  }

  // ===== TOGGLE CATEGORY SECTIONS =====
  function toggleSection(productList, filterContainer, category) {
    const isVisible = productList.style.display === 'grid';
    document.querySelectorAll('.category-section div[id$="product-list"]').forEach(div => div.style.display = 'none');
    document.querySelectorAll('.filter-container').forEach(f => f.style.display = 'none');

    if (!isVisible) {
      productList.style.display = 'grid';
      filterContainer.style.display = 'block';
      activeCategory = category;
    } else {
      activeCategory = null;
    }
  }

  viewMenBtn.addEventListener('click', () => toggleSection(menProducts, menFilters, 'men'));
  viewWomenBtn.addEventListener('click', () => toggleSection(womenProducts, womenFilters, 'women'));
  viewKiddiesBtn.addEventListener('click', () => toggleSection(kiddiesProducts, kiddiesFilters, 'kiddies'));
  viewHomeEssentialsBtn.addEventListener('click', () => toggleSection(homeEssentialsProducts, homeEssentialsFilters, 'home-essentials'));

  // ===== FILTER LOGIC =====
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (!activeCategory) return;

      const subcategory = this.dataset.category;
      let container;
      if (activeCategory === 'men') container = menProducts;
      else if (activeCategory === 'women') container = womenProducts;
      else if (activeCategory === 'kiddies') container = kiddiesProducts;
      else if (activeCategory === 'home-essentials') container = homeEssentialsProducts;
      if (!container) return;

      const filtered = allProducts.filter(
        p => p.category === activeCategory && (subcategory === 'all' || p.type === subcategory)
      );

      displayProducts(filtered, container, activeCategory);

      document.querySelectorAll(`#${activeCategory}-filters .filter-btn`).forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ===== CLEAR FILTERS =====
  document.querySelectorAll('.clear-filters').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!activeCategory) return;

      let container;
      if (activeCategory === 'men') container = menProducts;
      else if (activeCategory === 'women') container = womenProducts;
      else if (activeCategory === 'kiddies') container = kiddiesProducts;
      else if (activeCategory === 'home-essentials') container = homeEssentialsProducts;

      if (container) displayProducts(allProducts, container, activeCategory);

      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    });
  });

  // ===== ENABLE ADD TO CART =====
  document.body.addEventListener('change', e => {
    if (e.target.classList.contains('size-select') || e.target.classList.contains('color-select')) {
      const card = e.target.closest('.product-card');
      const addBtn = card.querySelector('.btn-add');

      const sizeVal = card.querySelector('.size-select')?.value;
      const colorVal = card.querySelector('.color-select')?.value;

      addBtn.disabled = !(sizeVal && colorVal);
    }
  });
});
