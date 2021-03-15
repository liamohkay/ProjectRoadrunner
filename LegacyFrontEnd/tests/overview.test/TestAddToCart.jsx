/* eslint-disable no-console */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

function TestAddToCart({
  product,
  selectedStyle,
  styleOptions,
  selectedSize,
  selectedQty,
  outOfStock,
}) {
  const [size, selectSize] = useState('S');
  const [sizeOptions, setSizeOptions] = useState(['S', 'L']);
  const [qty, selectQty] = useState(2);
  const [qtyOptions, setQtyOptions] = useState([1, 2]);
  const [sizeMenuOpen, toggleSizeMenu] = useState(false);
  const [qtyMenuOpen, toggleQtyMenu] = useState(false);
  const [message, changeMessage] = useState('');

  const handleSizeSelect = (sizeOption) => {
    selectSize(sizeOption.value);
    toggleSizeMenu(false);
    changeMessage('');
  };

  const handleQtySelect = (qtyOption) => {
    selectQty(qtyOption.value);
    toggleQtyMenu(false);
  };

  useEffect(() => {
    toggleSizeMenu(false);
    selectSize('');
    toggleQtyMenu(false);
  }, [product, selectedStyle]);

  const closeMenus = () => {
    if (sizeMenuOpen) {
      toggleSizeMenu(false);
    }
    if (qtyMenuOpen) {
      toggleQtyMenu(false);
    }
  };

  const add = () => {
    if (selectedSize !== '' && selectedQty > 0) {
      axios.post('/api/cart', null)
        .catch((err) => {
          console.error(err);
        });
      alert(`Added ${selectedQty} size ${selectedSize} product to cart!`);
    } else {
      changeMessage('PLEASE SELECT SIZE')
    }
  }

  return (
    <div>
      <span>{message}</span>
      <form role="form">
        <label htmlFor="size">Size</label>
        <Select
          data-testid="size"
          name="size"
          inputId="size"
          id="size"
          className="dropdown"
          widgetname="overview"
          onFocus={() => toggleSizeMenu(true)}
          blurInputOnSelect
          onChange={handleSizeSelect}
          value={[{ value: selectedSize, label: selectedSize }]}
          isDisabled={outOfStock}
          options={[{ label: 'S', value: 'S' }, { label: 'L', value: 'L' }]}
          menuIsOpen={sizeMenuOpen}
          isSearchable={false}
        />
        <label htmlFor="qty">Quantity</label>
        <Select
          data-testid="qty"
          name="qty"
          inputId="qty"
          id="qty"
          className="dropdown"
          widgetname="overview"
          onFocus={() => toggleQtyMenu(true)}
          blurInputOnSelect
          isDisabled={selectedSize === '' ? true : false}
          options={[{ label: 1, value: 1 }, { label: 2, value: 2 }]}
        />
      </form>
      <button
        type="button"
        onClick={() => add()}
      >
        <span>ADD TO BAG</span>
        <span>+</span>
      </button>
    </div >

  )
}

export default TestAddToCart;
