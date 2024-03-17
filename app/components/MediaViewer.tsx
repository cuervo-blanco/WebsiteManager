'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/MediaViewer.module.scss';
import ImageBlock from './ImageBlock';
import io from 'socket.io-client';
import { fetchData } from '../utils/fetchImages';
import { deleteImage } from '../utils/imageGetUtils';
import { MediaViewer } from '../utils/types';


function MediaViewer({ sendSelect, modalWindow, setImageSlot}: MediaViewer) {

	//States
	const [mediaInfo, setMediaInfo] = useState<{url: string, image_id: string, alt: string}[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [limit, setLimit] = useState(25);
	const [selectedMedia, setSelectedMedia] = useState<[string, string] | []>([]);
	const [loading, setLoading] = useState(true);
	const [MediaSelected, setMediaSelected] = useState(false);
	const isMounted = useRef(true);
    const [isModalOpen, setIsModalOpen] = useState(false);



	useEffect(() => {

		const socket = io('http://localhost:3002');

		fetchData(page, limit, setMediaInfo, setTotalPages, setLoading, isMounted);

		const onImageUploaded = (data: any) => {
			console.log('Image uploaded event received:', data.message);
			if(isMounted){
			fetchData(page, limit, setMediaInfo, setTotalPages, setLoading, isMounted);
			}
		}

		const onImageDeleted = (data: any) => {
			console.log('Image deleted event received:', data.message);
			if(isMounted){
			fetchData(page, limit, setMediaInfo, setTotalPages, setLoading, isMounted);
			setSelectedMedia([]);
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
	// Pass the selected image URL to the parent component
		if (selectedMedia.length === 0) {
			sendSelect([ImageUrl, ImageAlt]);
			setMediaSelected(true);
			}

		 else if (ImageUrl === selectedMedia[0]) {
			sendSelect([]);
			setMediaSelected(false);
		} else {
			//add second image to the selected image array
		}
	};

	const handleDeleteMedia = (toDeleteMedia: string) => {
		deleteImage(toDeleteMedia);
	}
	const setImage = () => {
		if (sendSelect !== null) {
		setImageSlot(selectedMedia);
		}
	}

	// Render the MediaViewer component
return (
    <div className={`${styles.mediaViewerContainer} ${modalWindow && isModalOpen ? styles.modalView : styles.standardView}`}>
        {modalWindow && isModalOpen && (
            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>×</button>
        )}

            {/* Display delete button if an image is selected */}
            {selectedMedia.length !== 0 && (
                <button onClick={() => handleDeleteMedia(selectedMedia[0])}>Delete</button>
            )}

            {/* Render loading state, images, or 'no images' message based on the current state */}
            {loading ? (
                <div>Loading...</div>
            ) : mediaInfo.length > 0 ? (
                mediaInfo.map(image => (
                    <ImageBlock
                        imgUrl={image.url}
                        key={image.image_id}
                        id={image.image_id}
                        imgAlt={image.alt}
                        select={handleImageSelect}
                        modalView={modalWindow}
                    />
                ))
            ) : (
               <div>No images to display</div>
            )}

            {modalWindow && MediaSelected && <button onClick={setImage}>Select Image</button>}

            {/* Pagination controls */}
            <div>
                {page > 1 && (
                    <button className={styles.paginationButton} onClick={() => setPage(page - 1)}>
                        Previous
                    </button>
                )}
                {page < totalPages && (
                    <button className={styles.paginationButton} onClick={() => setPage(page + 1)}>
                        Next
                    </button>
                )}
            </div>
    </div>
);
}
export default MediaViewer;
