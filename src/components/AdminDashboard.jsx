import React, { useState, useEffect } from 'react';
import { db, storage, auth } from './firebase'; // Firebase Firestore, Storage, and Auth instances
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [newHotel, setNewHotel] = useState({
    name: '',
    gallery: [],
    location: '',
    price: '',
    rating: '',
    facilities: '',
    policies: '',
    roomsAvailable: 0, // New field for rooms available
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      const hotelCollection = await getDocs(collection(db, 'hotels'));
      setHotels(hotelCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchHotels();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const addHotel = async () => {
    try {
      setUploading(true);
      const galleryUrls = await uploadImages(images);
      const docRef = await addDoc(collection(db, 'hotels'), { ...newHotel, gallery: galleryUrls });
      setHotels([...hotels, { id: docRef.id, ...newHotel, gallery: galleryUrls }]);
      resetForm();
    } catch (error) {
      console.error("Error adding hotel: ", error);
    } finally {
      setUploading(false);
    }
  };

  const updateHotel = async () => {
    try {
      setUploading(true);
      let galleryUrls = newHotel.gallery;
      if (images.length > 0) {
        galleryUrls = await uploadImages(images);
      }
      const hotelDoc = doc(db, 'hotels', editingHotelId);
      await updateDoc(hotelDoc, { ...newHotel, gallery: galleryUrls });
      setHotels(hotels.map(hotel => (hotel.id === editingHotelId ? { ...hotel, ...newHotel, gallery: galleryUrls } : hotel)));
      resetForm();
    } catch (error) {
      console.error("Error updating hotel: ", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editingHotelId ? updateHotel() : addHotel();
  };

  const editHotel = (id) => {
    const hotelToEdit = hotels.find(hotel => hotel.id === id);
    setNewHotel(hotelToEdit);
    setEditingHotelId(id);
  };

  const deleteHotel = async (id) => {
    try {
      await deleteDoc(doc(db, 'hotels', id));
      setHotels(hotels.filter(hotel => hotel.id !== id));
    } catch (error) {
      console.error("Error deleting hotel: ", error);
    }
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    if (selectedImages.length > 3) {
      alert("You can only upload up to 3 images.");
    } else {
      setImages(selectedImages);
    }
  };

  const uploadImages = async (imageFiles) => {
    const imageUrls = await Promise.all(imageFiles.map(async (imageFile) => {
      const storageRef = ref(storage, `hotels/${imageFile.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, imageFile);
      return await getDownloadURL(uploadTask.ref);
    }));
    return imageUrls;
  };

  const resetForm = () => {
    setNewHotel({
      name: '',
      gallery: [],
      location: '',
      price: '',
      rating: '',
      facilities: '',
      policies: '',
      roomsAvailable: 0,
    });
    setImages([]);
    setEditingHotelId(null);
  };

  // Placeholder functions for handling reservations
  const approveReservation = (id) => {
    console.log(`Approved reservation for hotel ID: ${id}`);
    // Logic to update the reservation status in Firestore
  };

  const declineReservation = (id) => {
    console.log(`Declined reservation for hotel ID: ${id}`);
    // Logic to update the reservation status in Firestore
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <h2>Admin Dashboard</h2>
        <div className="navbar-links">
          <Link to="/admin-dashboard">Dashboard</Link>
       
        
          <Link to="/reservations">Reservations</Link> {/* Link to Reservations page */}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      <h1>Manage Hotels</h1>

      <form onSubmit={handleSubmit}>
        <h2>{editingHotelId ? "Edit Hotel" : "Add New Hotel"}</h2>
        <input
          type="text"
          placeholder="Hotel Name"
          value={newHotel.name}
          onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={newHotel.location}
          onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price per night"
          value={newHotel.price}
          onChange={(e) => setNewHotel({ ...newHotel, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Star Rating"
          value={newHotel.rating}
          onChange={(e) => setNewHotel({ ...newHotel, rating: e.target.value })}
          required
        />
        <textarea
          placeholder="Facilities (comma separated)"
          value={newHotel.facilities}
          onChange={(e) => setNewHotel({ ...newHotel, facilities: e.target.value.split(',').map(f => f.trim()) })}
        />
        <textarea
          placeholder="Policies (comma separated)"
          value={newHotel.policies}
          onChange={(e) => setNewHotel({ ...newHotel, policies: e.target.value.split(',').map(p => p.trim()) })}
        />
        <input
          type="number"
          placeholder="Number of Rooms Available" // Input for available rooms
          value={newHotel.roomsAvailable}
          onChange={(e) => setNewHotel({ ...newHotel, roomsAvailable: e.target.value })}
          required
        />
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          accept="image/*"
        />
        {images.length > 3 && <p className="error">Please upload up to 3 images only.</p>}
        <button type="submit" disabled={uploading || images.length > 3}>
          {uploading ? 'Uploading...' : (editingHotelId ? 'Update Hotel' : 'Add Hotel')}
        </button>
      </form>

      <div>
        <h2>Your Hotels</h2>
        {hotels.map((hotel) => (
          <div key={hotel.id} className="hotel-item">
            <h3>{hotel.name}</h3>
            <p>Location: {hotel.location}</p>
            <p>Price: {hotel.price}</p>
            <p>Rating: {hotel.rating}</p>
            <p>Facilities: {Array.isArray(hotel.facilities) ? hotel.facilities.join(', ') : 'N/A'}</p>
            <p>Policies: {Array.isArray(hotel.policies) ? hotel.policies.join(', ') : 'N/A'}</p>
            <p>Rooms Available: {hotel.roomsAvailable}</p>
            {hotel.gallery.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`${hotel.name}-${index}`} width="100" />
            ))}
            <button onClick={() => editHotel(hotel.id)}>Edit</button>
            <button onClick={() => deleteHotel(hotel.id)}>Delete</button>
            {/* Buttons to approve and decline reservations */}
         
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
