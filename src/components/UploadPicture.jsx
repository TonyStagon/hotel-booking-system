// src/components/UploadPicture.jsx
import React, { useState, useEffect } from 'react';
import { storage, db, auth } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import './UploadPicture.css';
import CustomNavBar from './CustomNavBar';
const UploadPicture = () => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setProfilePicture(userDoc.data().profilePicture || null);
      }
    };
    fetchProfilePicture();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = () => {
    if (image) {
      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, 'users', auth.currentUser.uid), { profilePicture: downloadURL });
          setProfilePicture(downloadURL);
          alert('Profile picture uploaded successfully');
        }
      );
    }
  };

  const handleDelete = async () => {
    if (profilePicture) {
      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
      try {
        await deleteObject(storageRef);
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { profilePicture: null });
        setProfilePicture(null);
        alert('Profile picture removed successfully');
      } catch (error) {
        console.error('Error deleting profile picture:', error);
      }
    } else {
      alert('No profile picture to delete.');
    }
  };

  return (
    <div>
         <CustomNavBar />
    
    <div className="upload-picture-container">
         
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
      {profilePicture && <button onClick={handleDelete}>Delete Picture</button>}
      <progress value={progress} max="100" />
      {profilePicture && <img src={profilePicture} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />}
    </div></div>
  );
};

export default UploadPicture;
