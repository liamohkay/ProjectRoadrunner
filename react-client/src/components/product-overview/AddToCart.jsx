/* eslint-disable no-console */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import PropTypes from 'prop-types';

function AddToCart({
  product,
  selectedStyle,
  styleOptions,
  getStyleName,
  darkMode,
}) {
  const [size, selectSize] = useState('');
  const [sizeOptions, setSizeOptions] = useState([]);
  const [qty, selectQty] = useState(1);
  const [qtyOptions, setQtyOptions] = useState([]);
  const [sizeMenuOpen, toggleSizeMenu] = useState(false);
  const [qtyMenuOpen, toggleQtyMenu] = useState(false);
  const [outOfStock, warning] = useState(false);
  const [message, changeMessage] = useState('');

  function getQtyOrEntireSKU(sku = null) {
    // find selected style id in the styleOptions array
    for (const option of styleOptions) {
      if (option.style_id === selectedStyle) {
        for (const each in option.skus) {
          // find currently selected size of the style
          if (option.skus[each].size === size) {
            // use that quantity
            return sku ? each : option.skus[each].quantity;
          }
        }
      }
    }
    return null;
  }

  const getSizeOptions = () => {
    const current = [];

    // find selected style id in the styleOptions array
    for (const option of styleOptions) {
      if (option.style_id === selectedStyle) {
        // when found, use the size property of the objects in the option's skus to populate options
        if (Object.keys(option.skus).length) {
          if (outOfStock === true) {
            warning(false);
            changeMessage('');
          }
          for (const each in option.skus) {
            // only sizes that are currently in stock for the style selected should be listed
            if (option.skus[each].quantity > 0) {
              const o = option.skus[each].size;
              current.push({ value: o, label: o });
            }
          }
        } else if (outOfStock === false) {
          warning(true);
          changeMessage('OUT OF STOCK');
        }
      }
    }
    return setSizeOptions(current);
  };

  const getQtyOptions = () => {
    let numOfOptions = getQtyOrEntireSKU();

    // hard limit 15
    if (numOfOptions > 15) {
      numOfOptions = 15;
    }

    const options = [];
    for (let i = 1; i <= numOfOptions; i += 1) {
      options.push({ value: Number(i), label: String(i) });
    }

    setQtyOptions(options);
  };

  const pleaseSelectSize = () => {
    toggleSizeMenu(true);
    changeMessage('PLEASE SELECT A SIZE');
  };

  const add = () => {
    if (size === '') {
      pleaseSelectSize();
    } else if (qty > 0) {
      const cart = {
        sku_id: Number(getQtyOrEntireSKU('sku')),
      };
      axios.post('/api/cart', cart)
        // unneccessary get request, just confirms that it did get posted to cart api
        // .then(() => {
        //   axios.get('/api/cart', cart)
        //     .then((result) => {
        //       console.log('cart:', result.data);
        //     });
        // })
        .catch((err) => {
          console.error(err);
        });
      alert(`Added ${qty}${qty > 1 ? 'x' : ''} size ${size} ${product.name} in ${getStyleName()} to cart!`);
    }
  };

  const handleSizeSelect = (sizeOption) => {
    selectSize(sizeOption.value);
    toggleSizeMenu(false);
    changeMessage('');
  };

  useEffect(() => {
    getQtyOptions();
    selectQty(1);
  }, [size]);

  useEffect(() => {
    toggleSizeMenu(false);
    selectSize('');
    getSizeOptions();
    toggleQtyMenu(false);
  }, [product, selectedStyle]);

  const handleQtySelect = (qtyOption) => {
    selectQty(qtyOption.value);
    toggleQtyMenu(false);
  };

  const closeMenus = () => {
    if (sizeMenuOpen) {
      toggleSizeMenu(false);
    }
    if (qtyMenuOpen) {
      toggleQtyMenu(false);
    }
  };

  return (
    <div widgetname="overview" className="add-to-cart" onBlur={() => closeMenus()}>
      {styleOptions.length && selectedStyle !== 0 && product.hasOwnProperty('id')
        ? (
          <div widgetname="overview" style={{ display: 'flex', flexDirection: 'column' }}>
            <span widgetname="overview" className="add-to-cart-message">{message}</span>
            <div widgetname="overview" className="selector-container">
              <Select
                role="size-select"
                theme={darkMode ? (theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    neutral0: 'rgb(72,72,72)',
                    neutral10: 'rgb(240,240,240)',
                    neutral20: 'rgb(24,24,24)',
                    neutral30: 'rgb(24,24,24)',
                    neutral80: 'rgb(240,240,240)',
                    primary: 'rgb(255, 0, 140)',
                    primary25: 'rgb(255, 0, 140)',
                    primary50: 'rgb(24,24,24)'
                  }
                }) : (theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: 'rgb(255, 0, 140)',
                    primary25: 'rgb(250, 67, 168)',
                    primary50: 'rgb(250, 89, 177)',
                    primary75: 'rgb(253, 159, 211)'
                  }
                })}
                styles={{
                  option: (styles) => ({
                    ...styles,
                    cursor: 'pointer',
                  }),
                  control: (styles) => ({
                    ...styles,
                    cursor: 'pointer',
                  }),
                }}
                id="size"
                className="dropdown"
                widgetname="overview"
                onFocus={() => toggleSizeMenu(true)}
                blurInputOnSelect
                onChange={handleSizeSelect}
                value={[{ value: size !== '' ? size : outOfStock ? 'OUT OF STOCK' : 'SELECT SIZE', label: size !== '' ? size : outOfStock ? 'OUT OF STOCK' : 'SELECT SIZE' }]}
                isDisabled={outOfStock}
                options={sizeOptions}
                menuIsOpen={sizeMenuOpen}
                isSearchable={false}
              />

              <Select
                theme={darkMode ? (theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    neutral0: 'rgb(72,72,72)',
                    neutral10: 'rgb(240,240,240)',
                    neutral20: 'rgb(24,24,24)',
                    neutral30: 'rgb(24,24,24)',
                    neutral80: 'rgb(240,240,240)',
                    primary: 'rgb(255, 0, 140)',
                    primary25: 'rgb(255, 0, 140)',
                    primary50: 'rgb(24,24,24)'
                  }
                }) : (theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: 'rgb(255, 0, 140)',
                    primary25: 'rgb(250, 67, 168)',
                    primary50: 'rgb(250, 89, 177)',
                    primary75: 'rgb(253, 159, 211)'
                  }
                })}
                styles={{
                  option: (styles) => ({
                    ...styles,
                    cursor: 'pointer',
                  }),
                  control: (styles) => ({
                    ...styles,
                    cursor: 'pointer',
                  }),
                }}
                id="qty"
                className="dropdown"
                widgetname="overview"
                onFocus={() => toggleQtyMenu(true)}
                blurInputOnSelect
                onChange={handleQtySelect}
                value={[{ value: size !== '' ? qty : '-', label: size !== '' ? qty : '-' }]}
                isDisabled={size === '' ? true : false}
                options={qtyOptions}
              />
            </div>
            <div widgetname="overview" className="selector-container">
              {outOfStock ? null : (
                <button
                  widgetname="overview"
                  type="button"
                  className={darkMode ? "add-to-cart-dark" : "add-to-cart-button"}
                  onClick={() => add()}
                >
                  <span>ADD TO BAG</span>
                  <span>+</span>
                </button>
              )}
              <button
                widgetname="overview"
                type="button"
                className={darkMode ? "favorite-dark" : "favorite-button"}
                onClick={() => alert(`FAVORITED ${product.name}!`)}
              >
                ☆
              </button>
            </div>
          </div>
        )
        : null}
    </div>
  );
}

AddToCart.propTypes = {
  product: PropTypes.object,
  selectedStyle: PropTypes.number,
  styleOptions: PropTypes.array,
  getStyleName: PropTypes.func,
  darkMode: PropTypes.bool,
};

AddToCart.defaultProps = {
  product: {},
  selectedStyle: null,
  styleOptions: null,
  getStyleName: null,
  darkMode: false,
};

export default AddToCart;
