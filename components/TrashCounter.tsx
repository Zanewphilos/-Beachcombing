import React, { useState, useEffect } from 'react';
import { TrashCategories, TRASH_CATEGORIES } from '../types/TrashItems';
import styles from '../styles/TrashCounter.module.css';
import Modal from './Modal'; 
import { apiService_cleanup } from '../services/apiService/apiService_Cleanup';

type TrashCounts = {
  [category: string]: {
    [item: string]: number;
  };
};

export default function TrashCounter() {
  const [trashCounts, setTrashCounts] = useState<TrashCounts>({});
  const [showThankYou, setShowThankYou] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  const handleThankYouAcknowledge = () => {
    setShowThankYou(false);
  };

  const incrementCount = (category: string, item: string) => {
    setTrashCounts((prevCounts) => ({
      ...prevCounts,
      [category]: {
        ...prevCounts[category],
        [item]: (prevCounts[category]?.[item] || 0) + 1,
      },
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      // Add new images to state
      setSelectedImages([...selectedImages, ...filesArray]);
      setImagePreviews([...imagePreviews, ...newImageUrls]);
    }
  };

  const toggleGallery = () => {
    setShowGallery(!showGallery);
  };

    const handleSubmit = () => {
      setShowConfirmSubmit(true); 
    };

    const handleConfirmSubmit = async () => {
      try {
        
        console.log('Collected Trash Counts:', trashCounts);
        console.log('Selected Image Files:', selectedImages);
  
        const submissionData = {
          trashCounts: JSON.stringify(trashCounts),
          images: selectedImages,
        };
  
        const response = await apiService_cleanup.submitCleanupRecord(submissionData);
        console.log('Submission response:', response);
  
        // submit success
        setShowConfirmSubmit(false); // close confirm modal
        setShowThankYou(true); // render thank you modal
        setSelectedImages([]); // reset selected images
        setImagePreviews([]); // reset image previews
        setTrashCounts({}); //reset trash counts
      } catch (error) {
        console.error('Submission error:', error);
        alert('There was an issue submitting your cleanup record. Please try again.');
      }
    };

    const handleCancelSubmit = () => {
      setShowConfirmSubmit(false);// cancel submit
    };

  return (
    <div className={styles.trashCounter}>

      {showConfirmSubmit && (
        <Modal onClose={handleCancelSubmit}>
          <p>Are you sure you want to submit?</p>
          <button onClick={handleConfirmSubmit}>Yes</button>
          <button onClick={handleCancelSubmit}>No</button>
        </Modal>
      )}

     
      {showThankYou && (
        <Modal onClose={handleThankYouAcknowledge}>
          <p>Thank you for your collecting.</p>
          <button onClick={handleThankYouAcknowledge}>OK</button>
        </Modal>
      )}
      {/* Trash buttons */}
        {Object.entries(TRASH_CATEGORIES).map(([category, items]) => (
        <div key={category}>
          <h2 className={styles.categoryHeader}>{category}</h2>
          {items.map((item) => (
            <button key={item} onClick={() => incrementCount(category, item)} className={styles.itemButton}>
              {item} - {trashCounts[category]?.[item] || 0}
            </button>
          ))}
        </div>
      ))}
        
       {/* Upload and Gallery buttons */}
       <div className={styles.imageButtonContainer}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          id="image-upload"
          style={{ display: 'none' }}
        />
        <label htmlFor="image-upload" className={styles.uploadLabel}>
          Upload Images
        </label>
        <button
          onClick={toggleGallery}
          className={`${styles.viewAllButton} ${imagePreviews.length === 0 ? styles.disabledButton : ''}`}
          disabled={imagePreviews.length === 0}
        >
          View All Images
        </button>
      </div>
      {/* Image preview or placeholder */}
      <div className={styles.imagePreviewContainer}>
            {imagePreviews.length > 0 ? (
          <img src={imagePreviews[imagePreviews.length - 1]} alt="Preview" className={styles.latestImagePreview} />
        ) : (
          <div className={styles.imagePlaceholder}>No image uploaded</div>
        )}
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <Modal onClose={() => setShowGallery(false)}>
          <div className={styles.gallery}>
            <button onClick={() => setShowGallery(false)} className={styles.closeGalleryButton}>
              &times;
            </button>
            {imagePreviews.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index}`} className={styles.galleryImage} />
            ))}
          </div>
        </Modal>
      )}
      

      {/* Submit button */}
      <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
      </div>
    );
  }