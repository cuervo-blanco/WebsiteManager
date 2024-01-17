'use client';
import React, { useState, useRef } from 'react';
import { uploadFile } from '../utils/fileUploadUtils.js';
import styles from '../styles/fileUploader.module.scss';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      console.log(file); // Log the selected file
    } else {
      console.log('No file uploaded');
      setSelectedFile(null);
    }
  };

  const handleAltTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAltText(event.target.value);
	    };

  const handleUpload = async () => {
    if (selectedFile) {
		
		const formData = new FormData();
		formData.append('file', selectedFile);
		formData.append('alt', altText);

      try {
        const result = await uploadFile(formData);
        console.log('Upload result:', result);
      } catch (error) {
        console.error('Error during file upload:', error);
      }
      setSelectedFile(null); // Clear the selected file after upload
	  setAltText('');
      clearFileInput();
    }
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id={styles.fileUploaderContainer}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*, audio/*, video/*, .pdf"
        onChange={handleFileChange} required
      />
	  <input type="text"  value={altText} name="alt" onChange={handleAltTextChange} placeholder="Enter short description for the image" required/> 
      <button onClick={handleUpload}>Upload File</button>
    </div>
  );
};

export default FileUploader;

