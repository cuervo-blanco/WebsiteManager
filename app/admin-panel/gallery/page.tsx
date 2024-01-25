'use client';
import React, { useState, useEffect } from 'react';
import styles from '../../styles/gallery.module.scss'
import MediaViewer from '../../components/MediaViewer';
import ImageSlot from  '../../components/ImageSlot';
import SelectWindow from '../../components/SelectWindow'; 
import { updateIllustrations } from '../../utils/fileUploadUtils';
import LinkEditor from '../../components/LinkEditor';
import ToggleWindow from '../../components/ToggleWindow';
import MediaInfoCard from '../../components/MediaInfoCard';
import { Content } from '../../utils/types';




const Gallery = () => {
	const [selectedMedia, setSelectedMedia] = useState<[string, string] | [] >([]);
	const [selectedItemId, setSelectedItemId] = useState<string>("");
	const [loadedContent, setLoadedContent] = useState<Content[]>([])
	const [isEditOptionsVisible, showEditOptions] = useState<boolean>(false);	
	const [isMediaGalleryVisible, showMediaGallery] = useState<boolean>(false);
	const [isEditMade, setEditMade] = useState<boolean>(false);
	const [isLinkEditorVisible, showLinkEditor] = useState<boolean>(false);



		const handleMediaSelected = (mediaSelected: [string, string]) => {
			setSelectedMedia(mediaSelected);
		}

	useEffect(() => {
	fetch('/api/get-gallery-content')
            .then(response => response.json())
            .then(data => {
                setLoadedContent(data);
            });
    }, []);

	const handleItemSelection= (selectedId: string) => {
		showEditOptions(true);
		showLinkEditor(false);
		setSelectedItemId(selectedId);	
	}

	const toggleMediaGalleryVisibility = () => { 
		showMediaGallery(true);
		showEditOptions(false);
	} 

	const updateSelectedSlot = () => {
		//First we destructure the src and alt from the selectedImage
		const [newSrc, newAlt] = selectedMedia || [ '', '' ]; 
		//Now we find the index of the image slot with the matching connectionId
		const indexToUpdate = loadedContent.findIndex(image => image.connection_id === selectedItemId);
		// If a match is found
		if(indexToUpdate !== -1) {
		//Create a new array with the updated image slot
			const updatedImages = [
				...loadedContent.slice(0, indexToUpdate),
				{... loadedContent[indexToUpdate], src: newSrc!, alt: newAlt! },
				...loadedContent.slice(indexToUpdate + 1)
			];
			//Update the state with the new array
			setLoadedContent(updatedImages);
		}
		showMediaGallery(false);
		setEditMade(true);
	}

	const handleSaveChanges = async (changes: Content[]) => {
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

	const handleEditLink = () => {
	showLinkEditor(true);
	showEditOptions(false);
	}

	const handleLinkUpdate = (updatedLink: Content[]) => {
		setLoadedContent(updatedLink);
		setEditMade(true);
		showLinkEditor(false);
	}

	return(
	<div id={styles.galleryContainer}>
		<h1>Welcome to the gallery editor!</h1>
		{ isMediaGalleryVisible && <MediaViewer sendSelect={handleMediaSelected} modalWindow={true} setImageSlot={updateSelectedSlot}/> } 
		{ isLinkEditorVisible && <LinkEditor items={loadedContent} connection_id={selectedItemId} onItemsUpdate={handleLinkUpdate}/>}
		{ isEditOptionsVisible && <SelectWindow select={toggleMediaGalleryVisibility} editLink={handleEditLink}/>}

		<ToggleWindow title="Illustrations" rows={3} behavior="fixed"> 
			{loadedContent.map(slot  => 	
				<ImageSlot
					key={slot.connection_id}
					src={slot.src}
					alt={slot.alt}
					link={slot.link}
					setSelectedId={handleItemSelection}
					connection_id={slot.connection_id}
					/>  
			)}
		</ToggleWindow>
		<ToggleWindow title="Products & Services" rows={3} behavior="additive" >

		{/*Map through the loadedContent to generate MediaInfoCard components */} 
		<MediaInfoCard/>

		</ToggleWindow>
		{isEditMade && <button onClick={() => handleSaveChanges(loadedContent)}>Save Changes</button>}
	</div>
	)
}

export default Gallery;
