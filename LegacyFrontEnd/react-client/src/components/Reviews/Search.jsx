import React, { useState, useEffect } from 'react';

const Search = ({ searchReviews, searchQuery, setSearchQuery }) => {
  const updateSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div widgetname="reviews" className="search-reviews" >
      <form widgetname="reviews">
        <span widgetname="reviews">
          <input widgetname="reviews" onChange={updateSearchQuery} type="search" name="inputText" placeholder="search.." />
        </span>
      </form>
    </div>
  );
};

export default Search;
