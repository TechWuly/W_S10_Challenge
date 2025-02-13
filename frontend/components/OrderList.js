import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../state/store';

export default function OrderList() {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.orders);
  const [selectedSize, setSelectedSize] = useState('All');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleFilterClick = (size) => {
    setSelectedSize(size);
  };

  const filteredOrders = selectedSize === 'All'
    ? orders
    : orders.filter(order => order.size === selectedSize);

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      {status === 'loading' && <p>Loading orders...</p>}
      {status === 'failed' && <p>Error: {error}</p>}

      <ol>
        {filteredOrders.map((order) => (
          <li key={order.id}>
            <div>
              {order.customer} ordered a size {order.size} with {order.toppings.length} toppings
            </div>
          </li>
        ))}
      </ol>

      <div id="sizeFilters">
        Filter by size:
        {['All', 'S', 'M', 'L'].map((size) => (
          <button
            data-testid={`filterBtn${size}`}
            className={`button-filter ${selectedSize === size ? 'selected' : ''}`}
            key={size}
            onClick={() => handleFilterClick(size)}
          >
            {size}
          </button>
        ))}
      </div>

      <style>
        {`
          .button-filter {
            background-color: white;
            border: 1px solid #ccc;
            padding: 5px 10px;
            margin: 5px;
            cursor: pointer;
          }
          .button-filter.selected {
            background-color: #FF4B00;
            color: white;
          }
        `}
      </style>
    </div>
  );
}
