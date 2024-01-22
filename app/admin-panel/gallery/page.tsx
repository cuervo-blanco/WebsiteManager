'use client';
import React, {useState, useEffect} from 'react';
import styles from '../../styles/gallery.module.scss';
import ToggleWindow from '../../components/ToggleWindow';
import MediaViewer from '../../components/MediaViewer';
import ImageSlot from  '../../components/ImageSlot';
import SelectWindow from '../../components/SelectWindow'; 
import { updateIllustrations } from '../../utils/fileUploadUtils';

interface LoadedImages {
	connection_id: string;
	src: string | undefined;
	alt: string | undefined;
	link: string;
}


const Gallery = () => {

		const [selectedImage, setSelectedImage] = useState<[string, string] | [] >([]);
		const [selectedImageSlotId, setSelectedImageSlotId] = useState<string>("");
		const [loadedImages, setLoadedImages] = useState<LoadedImages[]>([])
		const [showEditOptions, setShowEditOptions] = useState<boolean>(false);	
		const [showMediaGallery, setShowMediaGallery] = useState<boolean>(false);
		const [editMade, setEditMade] = useState<boolean>(false);

		console.log('Selected Image slot: ', selectedImageSlotId);



		const handleImageSelected = (imageSelected: [string, string]) => {
			setSelectedImage(imageSelected);
		}

	useEffect(() => {
	fetch('/api/gallery-images')
            .then(response => response.json())
            .then(data => {
                setLoadedImages(data);
            });
    }, []);

	const handleSelectSlotId = (selectedSlot: string) => {
		setShowEditOptions(true);
		setSelectedImageSlotId(selectedSlot);	
	}

	const handleOpenMediaGallery = () => { 
		setShowMediaGallery(true);
		setShowEditOptions(false);
	} 

	const handleSetImageSlot = () => {
	//First we destructure the src and alt from the selectedImage
	const [newSrc, newAlt] = selectedImage || [ '', '' ]; 
	//Now we find the index of the image slot with the matching connectionId
	const indexToUpdate = loadedImages.findIndex(image => image.connection_id === selectedImageSlotId);
	// If a match is found
	if(indexToUpdate !== -1) {
	//Create a new array with the updated image slot
		const updatedImages = [
			...loadedImages.slice(0, indexToUpdate),
			{... loadedImages[indexToUpdate], src: newSrc!, alt: newAlt! },
			...loadedImages.slice(indexToUpdate + 1)
		];
	//Update the state with the new array
	setLoadedImages(updatedImages);
	}

	setShowMediaGallery(false);
	setEditMade(true);


	}

	
const handleSaveChanges = async (changes: LoadedImages[]) => {
    try {
        // First endpoint
        const result = await updateIllustrations(changes);
		setEditMade(false);
        console.log('Upload result:', result);
      } catch (error) {
        console.error('Error during file upload:', error);
		setEditMade(true);
      }
}



	return(
	<div id={styles.galleryContainer}>
		<h1>Welcome to the gallery editor!</h1>
		{ showMediaGallery && <MediaViewer sendSelect={handleImageSelected} modalWindow={true} setImageSlot={handleSetImageSlot}/> } 
		{ showEditOptions && <SelectWindow select={handleOpenMediaGallery}/>}

		<ToggleWindow title="Illustrations" rows={3} behavior="fixed"> 
			{loadedImages.map(slot  => 	
				<ImageSlot
					key={slot.connection_id}
					src={slot.src}
					alt={slot.alt}
					link={slot.link}
					select={handleSelectSlotId}
					connectionId={slot.connection_id}
					/>  
			)}
		</ToggleWindow>
		{editMade && <button onClick={() => handleSaveChanges(loadedImages)}>Save Changes</button>}
	</div>
	)
}

export default Gallery;
