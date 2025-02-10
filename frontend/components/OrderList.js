import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../state/store';

export default function OrderList() {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      {status === 'loading' && <p>Loading orders...</p>}
      {status === 'failed' && <p>Error: {error}</p>}

      <ol>
        {orders.map((order) => (
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
            className="button-filter"
            key={size}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
