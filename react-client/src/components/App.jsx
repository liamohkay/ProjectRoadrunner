import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {
  Switch, Grid, Typography, Button, Paper,
} from '@material-ui/core';
import Overview from './product-overview/Overview.jsx';
import RelatedItemsList from './related items/RelatedItemsList.jsx';
import YourOutfitList from './related items/YourOutfitList.jsx';
import Reviews from './Reviews/Reviews.jsx';
import QA from './Questions-Answers/QA.jsx';
import ClickTracker from './ClickTracker.jsx';

function App() {
  const [selectedProduct, updateSelectedProduct] = useState({});
  const [metadata, updateMetadata] = useState('');
  const [avgRatings, updateAvgRatings] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (metadata.ratings) {
      findAvgRating();
    }
  }, [metadata]);

  const findAvgRating = () => {
    const ratingsData = metadata.ratings;
    if (Object.keys(ratingsData).length === 0) {
      return '';
    }
    let totalScore = 0;
    let amountOfRatings = 0;
    for (const key in ratingsData) {
      const value = Number(ratingsData[key]);
      const actualValue = key * value;
      totalScore += actualValue;
      amountOfRatings += value;
    }
    const averageScore = totalScore / amountOfRatings;
    const rounded = Math.round(averageScore * 4) / 4;
    updateAvgRatings(rounded);
  };

  const selectProduct = (id) => {
    axios.get(`/api/shared/products/${id}`)
      .then((results) => {
        updateSelectedProduct(results.data);
      })
      .catch((err) => (console.log(err)));
  };

  const getProducts = () => {
    const id = 16060;
    axios.get(`/api/shared/products/${id}`)
      .then((data) => {
        updateSelectedProduct(data.data);
      })
      .then(() => (getRatings()))
      .catch((err) => {
        console.log(err);
      });
  };

  const getRatings = () => {
    const { id } = selectedProduct;
    axios.get(`/api/reviews/meta?product_id=${id}`)
      .then((result) => {
        updateMetadata(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
    },
  });


  return (
    <ThemeProvider theme={theme}>
      <Paper>
        <div>
          <div className="switch-container" widgetname="overview">
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </div>
          <ClickTracker render={(clickTracker) => (
            <>
              <Overview
                clickTracker={clickTracker}
                product={selectedProduct}
                avgRating={avgRatings}
                darkMode={darkMode}
              />
              <RelatedItemsList
                clickTracker={clickTracker}
                selectProduct={selectProduct}
                currentProduct={selectedProduct}
              />
              <YourOutfitList
                clickTracker={clickTracker}
                avgRating={avgRatings}
                currentProduct={selectedProduct}
                findAvgRating={findAvgRating}
              />
              <QA
                clickTracker={clickTracker}
                currentProduct={selectedProduct}
              />
              <Reviews
                clickTracker={clickTracker}
                avgRating={avgRatings}
                metadata={metadata}
                getRatings={getRatings}
                currentProduct={selectedProduct.id}
              />
            </>
          )}
          />
        </div>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
