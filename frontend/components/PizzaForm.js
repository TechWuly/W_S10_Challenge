import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message at the start
    setIsLoading(true); // Set loading state to true


     // Client-side validation
     if (!formState.fullName) {
      setErrorMessage("Order failed: fullName is required");
      return;
    }
    if (formState.fullName.length < 3 || formState.fullName.length > 20) {
      setErrorMessage("Order failed: fullName must be at least 3 characters");
      return;
    }
    if (!formState.size) {
      setErrorMessage("Order failed: size must be one of the following values: S, M, L");
      return;
    }
    const validSizes = ["S", "M", "L"];
    if (!validSizes.includes(formState.size)) {
      setErrorMessage("Size must be 'S', 'M', or 'L'.");
      return;
    }

    // Extract selected toppings
    const selectedToppings = Object.keys(toppingsMap)
      .filter((key) => formState[key]);

    const orderData = {
      fullName: formState.fullName,
      size: formState.size,
      toppings: selectedToppings,
    };

    console.log("Request Payload:", orderData);

    try {
      
      await dispatch(placeOrder(orderData)); // Dispatch order and await response

    } catch (error) {
      // Handle server-side validation errors
      if (error.response && error.response.status === 422) {
        const errorMessages = error.response.data; // Adjust based on actual response structure
        const messageArray = Object.entries(errorMessages)
          .map(([key, message]) => `${key}: ${message}`);
        setErrorMessage(messageArray.join(", "));
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
    setIsLoading(false); // Stop loading regardless of success or failure
}
    
    // Reset form state after successful submission
    setFormState(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pizza Form</h2>
      
        {/* Show loading message */}
        {isLoading && <div>Order in progress...</div>}

      {/* Move the error message to the top of the form */}
      {errorMessage && <div className='failure'>{errorMessage}</div>} {/* Error message now at the top */}


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
              data-testid={`check${label.replace(/\s+/g, "").charAt(0).toUpperCase() + label.replace(/\s+/g, "").slice(1).toLowerCase()}`}

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
