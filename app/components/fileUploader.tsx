'use client';
import React, { useState, useRef, useEffect } from 'react';
import { uploadFile } from '../utils/fileUploadUtils.js';
import styles from '../styles/fileUploader.module.scss';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
        if (selectedFile && selectedFile.type.startsWith('image/')) {
          const previewUrl = URL.createObjectURL(selectedFile);
          setFilePreviewUrl(previewUrl);

          // Cleanup funciton to revoke the object URL to avoid memory leaks
          return () => URL.revokeObjectURL(previewUrl);
        } else {
            setFilePreviewUrl(null);
        }
    }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      console.log(file); // Log the selected file
    } else {
      console.log('No file uploaded');
      setSelectedFile(null);
      setFilePreviewUrl(null);
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
      <input id="fileInput"
        className={styles.fileInput}
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange} required
        style={{ display: 'none'  }}
      />
        <label htmlFor="fileInput"
                id="fileInputLabel">Choose a file</label>
            {filePreviewUrl &&
                <>
                    <img src={filePreviewUrl} alt="Preview" style={{ width: 100, height: 100}} />
                    <input type="text"  value={altText} name="alt" onChange={handleAltTextChange} placeholder="Enter short description for the image" required/>
                    <button onClick={handleUpload}>Upload File</button>
            </>

            }

    </div>
  );
};

export default FileUploader;

