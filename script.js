document.addEventListener('DOMContentLoaded', () => {
  const featuredContainer = document.getElementById('featured-products');

  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      const featured = products.filter(p => p.featured).slice(0, 6);

      featured.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;

        // Image, title, price
        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>R${product.price}</p>
        `;

        // Dropdown wrapper
        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.className = 'dropdowns-wrapper';

        // Top "Select" label
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

        // Add-to-Cart button
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-add';
        addBtn.textContent = 'Add to Cart';
        addBtn.disabled = true;
        card.appendChild(addBtn);

        featuredContainer.appendChild(card);
      });
    })
    .catch(err => console.error('Error loading featured products:', err));

  // Enable Add-to-Cart
  featuredContainer.addEventListener('change', e => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    const addBtn = card.querySelector('.btn-add');
    const sizeSelect = card.querySelector('.size-select');
    const colorSelect = card.querySelector('.color-select');

    let enable = true;
    if (sizeSelect && !sizeSelect.value) enable = false;
    if (colorSelect && !colorSelect.value) enable = false;

    addBtn.disabled = !enable;
  });
});
