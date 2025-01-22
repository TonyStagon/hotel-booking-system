import React, { useState } from 'react';
import { addAccommodation } from './firestoreService';  // Adjust the path accordingly

const AddAccommodationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const newAccommodationId = await addAccommodation(formData);
      setSuccess(`Accommodation added with ID: ${newAccommodationId}`);
      setFormData({ name: '', description: '', price: '' });  // Reset form
    } catch (err) {
      setError('Error adding accommodation: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Add New Accommodation</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Accommodation Name"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <button type="submit">Add Accommodation</button>
      </form>
    </div>
  );
};

export default AddAccommodationForm;
