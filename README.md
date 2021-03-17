# Project-Catwalk

Forever 32 is an E-commerce website that refactored an outdated retail portal provided by a contracted company. The implemented features modernize the user experience of customers browsing items in the retail catalog.

# Table of Contents

* [Installation Guide](https://github.com/Sarahs-Minions/Project-Catwalk/blob/testing/README.md#installation)
* [Product Overview](https://github.com/Sarahs-Minions/Project-Catwalk/blob/testing/README.md#overview)  
* [Related Products](https://github.com/Sarahs-Minions/Project-Catwalk/blob/testing/README.md#related-items)  
* [Questions and Answers](https://github.com/Sarahs-Minions/Project-Catwalk/blob/testing/README.md#qa)  
* [Reviews](https://github.com/Sarahs-Minions/Project-Catwalk/blob/testing/README.md#reviews)  

# Installation
We are using:

Node / NPM
ES2015 (and beyond) support
React 17.0
Axios
Express


We use npm to handle dependencies.

```
npm install
```

## Production Build
```
npm run prod
```
## Development Server
Run ```npm run start``` and navigate to ```http://localhost:3000/```

# Description
This project is split into 4 componenets: Product Overview, Related Products, Questions & Answers, and Reviews

## Product Overview

This component guides the customer through selecting a specific style and size to add to their cart.
It displays the star rating, price/sale price, and the product's title, category, slogan & description.
Below the information, the user can use the circular thumbnails to select various styles for the product, one at a time.
Below the style selector, two dropdowns allow the user to select the size and quantity of the item/style to add to their cart.
The add to cart button is hidden if there's no stock, will prompt the user to select a size and open the size dropdown automatically if they click it with no size selected, and will add the product to the user cart if the selections are valid.
The image gallery displays photos specific to the currently selected style. The user can navigate the default view with either the arrow buttons or by clicking specific thumbnails on the left side.
When the main image is clicked, a fullscreen view of it will open up, with an X button to close it. On the fullscreen view the user can navigate with the arrow buttons and circular icons in the same way as the default view. Clicking the fullscreen view zooms the image 250%, and clicking it again returns to the 100% view.

## Related Products
The Related Products section is a carousel of products that are related to the current product being displayed in the Product Overview section above. This carousel consists of multiple individual cards that display each item’s thumbnail, category, name, price, and average rating. When the item card is clicked, the website navigates to the Product Overview page of that item. Each card also has a ☆ button, located in the top right corner, that opens up a comparison modal which shows the features of both the current product and the card item. If the products have the feature a checkmark is displayed next to the feature, under the product name.

The Your Outfit section is like a wishlist, it lets the user add products. A product can only be added once to this list and removed by clicking the ⓧ button in the top right corner.  This list is unique to each user and the products in this list will persist for each user even if they exit the website and return at a later time.


## Q & A
The Questions & Answers module can be divided into several pieces:  
* View questions.  
* Search for a question.  
* Asking a question.  
* Answering a question.  

This component extends the ability to view and search questions, ask questions, answer questions and provide feedback on questions about the current product. 



## Reviews
The reviews section displays the reviews for the current product. There is functionality to add a new review and will display two reviews by default. Clicking the button to add more reviews will load two more reviews onto the page. 
In addition to the reviews section there is also a subsection for the ratings for that current product. The ratings section will give a breakdown of the percentages chosen for each star rating. The ratings section will also display a chart that shows the score each characteristic got. 

