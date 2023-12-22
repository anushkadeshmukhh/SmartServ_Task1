// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const apiUrl = 'https://s3.amazonaws.com/open-to-cors/assignment.json';
const itemsPerPage = 10;

function App() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTable, setShowTable] = useState(false);

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;
      const productsData = Object.values(data.products);
      productsData.sort((a, b) => b.popularity - a.popularity);
      setProducts(productsData);
      setCurrentPage(1);
      setShowTable(true); // Set showTable to true after fetching data
    } catch (error) {
      console.error('Error fetching data from the API:', error.message);
    }
  };

  // Calculate the index of the first and last items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Next page
  const nextPage = () => {
    if (currentPage < Math.ceil(products.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for display
  const getPageNumbers = () => {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const maxPageButtons = 3;

    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }).map((_, index) => index + 1);
    }

    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    return Array.from({ length: endPage - startPage + 1 }).map((_, index) => startPage + index);
  };

  return (
    <div className="container">
      
      <button onClick={fetchData}>Fetch Products</button>
      {showTable && (
        <>
          <h1>Products Ordered By Descending Popularity</h1>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1 + indexOfFirstItem}</td>
                  <td>{product.title}</td>
                  <td>{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Prev
            </button>
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={pageNumber === currentPage ? 'active' : ''}
              >
                {pageNumber}
              </button>
            ))}
            <button onClick={nextPage} disabled={currentPage === Math.ceil(products.length / itemsPerPage)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
