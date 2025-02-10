import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../state/store';

const initialFormState = {
  fullName: '',
  size: '',
  '1': false,
  '2': false,
  '3': false,
  '4': false,
  '5': false,
};

export default function PizzaForm() {
  const [formState, setFormState] = useState(initialFormState);
  const dispatch = useDispatch();
  const orderStatus = useSelector((state) => state.orders.status);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toppingsMap = {
    "1": "Pepperoni",
    "2": "Green Peppers",
    "3": "Pineapple",
    "4": "Mushrooms",
    "5": "Ham",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extract selected toppings
    const selectedToppings = Object.keys(toppingsMap)
      .filter((key) => formState[key]);

    const orderData = {
      fullName: formState.fullName,
      size: formState.size,
      toppings: selectedToppings,
    };

    console.log("Request Payload:", orderData);
    dispatch(placeOrder(orderData));
    
    // Reset form state after successful submission
    setFormState(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pizza Form</h2>
      {orderStatus === 'loading' && <div className='pending'>Order in progress...</div>}
      {orderStatus === 'failed' && <div className='failure'>Order failed: fullName is required</div>}

      <div className="input-group">
        <label htmlFor="fullName">Full Name</label><br />
        <input
          data-testid="fullNameInput"
          id="fullName"
          name="fullName"
          placeholder="Type full name"
          type="text"
          value={formState.fullName}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <label htmlFor="size">Size</label><br />
        <select
          data-testid="sizeSelect"
          id="size"
          name="size"
          value={formState.size}
          onChange={handleChange}
        >
          <option value="">----Choose size----</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
      </div>

      <div className="input-group">
        {Object.entries(toppingsMap).map(([key, label]) => (
          <label key={key}>
            <input
              data-testid={`check${label.replace(/\s/g, '')}`}
              name={key}
              type="checkbox"
              checked={formState[key]}
              onChange={handleChange}
            />
            {label}<br />
          </label>
        ))}
      </div>

      <input data-testid="submit" type="submit" />
    </form>
  );
}
