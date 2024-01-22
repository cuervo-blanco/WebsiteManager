'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/MediaViewer.module.scss';
import ImageBlock from './ImageBlock';
import io from 'socket.io-client';
import { fetchData } from '../utils/fetchImages'; 
import { deleteImage } from '../utils/imageGetUtils';

interface MediaViewer {
	sendSelect: Function | null;
	modalWindow: boolean;
	setImageSlot: Function;

}


function MediaViewer({ sendSelect, modalWindow, setImageSlot}: MediaViewer) {

	//States
	const [images, setImages] = useState<{url: string, image_id: string, alt: string}[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [limit, setLimit] = useState(25);
	const [selectedImage, setSelectedImage] = useState<[string, string] | []>([]);
	const [loading, setLoading] = useState(true);
	const [ImageSelected, setImageSelected] = useState(false);
	const isMounted = useRef(true);



	useEffect(() => {

		const socket = io('http://localhost:3002');

		fetchData(page, limit, setImages, setTotalPages, setLoading, isMounted);

		const onImageUploaded = (data: any) => {
			console.log('Image uploaded event received:', data.message);
			if(isMounted){
			fetchData(page, limit, setImages, setTotalPages, setLoading, isMounted);
			}
		}

		const onImageDeleted = (data: any) => {
			console.log('Image deleted event received:', data.message);
			if(isMounted){
			fetchData(page, limit, setImages, setTotalPages, setLoading, isMounted);
			setSelectedImage([]);
			}
		}


	// Listen for the 'image-uploaded' event
		socket.on('image-uploaded', onImageUploaded);
		socket.on('image-deleted', onImageDeleted);

		return () => {
		isMounted.current = false;
		socket.off('image-uploaded', onImageUploaded);
		socket.off('image-deleted', onImageDeleted);
		}
}, [page, limit]);


	const handleImageSelect = (ImageUrl: string, ImageAlt: string) => {
	console.log("handleImageSelect called with URL:", selectedImage);
	// Pass the selected image URL to the parent component
		if (selectedImage.length === 0) {
			sendSelect([ImageUrl, ImageAlt]);
			setImageSelected(true);
			}

		 else if (ImageUrl === selectedImage[0]) {
			sendSelect([]);
			setImageSelected(false);
		} else {
			//add second image to the selected image array
		}
	};

	const handleDeleteImage = (toDeleteImage: string) => {
		deleteImage(toDeleteImage);
	}
	const setImage = () => {
		if (sendSelect !== null) {
		setImageSlot(selectedImage);
		}
	}

	// Render the MediaViewer component
    return (
        <div id={styles.mediaViewerContainer}>
            {/* Display delete button if an image is selected */}
            {selectedImage.length !== 0 && <button onClick={() => handleDeleteImage(selectedImage[0])}>Delete</button>}
            {/* Render loading state, images, or 'no images' message based on the current state */}
            {loading ? (
                <div>Loading...</div>
            ) : images.length > 0 ? (
                images.map(image => (
                    <ImageBlock 
                        imgUrl={image.url} 
                        key={image.image_id} 
                        id={image.image_id} 
                        imgAlt={image.alt} 
                        select={handleImageSelect}
                    />
                ))
            ) : ( 
                <div>No images to display</div> 
            )}

			{modalWindow && ImageSelected && <button onClick={setImage}>Select Image</button>}

            {/* Pagination buttons */}
            {page > 1 && <button onClick={() => setPage(page - 1)}>Previous</button>}
            {page < totalPages && <button onClick={() => setPage(page + 1)}>Next</button>}
        </div>
    );
}
export default MediaViewer;
