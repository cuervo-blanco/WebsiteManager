'use client';
import React, { useState, useRef } from 'react';
import { uploadFile } from '../utils/fileUploadUtils.js';
import styles from '../styles/fileUploader.module.scss';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const result = await uploadFile(selectedFile);
        console.log('Upload result:', result);
      } catch (error) {
        console.error('Error during file upload:', error);
      }
      setSelectedFile(null); // Clear the selected file after upload
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
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload File</button>
    </div>
  );
};

export default FileUploader;

