'use client';
import React, { useState, useEffect } from 'react';
import styles from '../../styles/gallery.module.scss'
import MediaViewer from '../../components/MediaViewer';
import ImageSlot from  '../../components/ImageSlot';
import SelectWindow from '../../components/SelectWindow'; 
import { updateContent } from '../../utils/fileUploadUtils';
import LinkEditor from '../../components/LinkEditor';
import ToggleWindow from '../../components/ToggleWindow';
import MediaInfoCard from '../../components/MediaInfoCard';
import SimpleTextEditor from '../../components/SimpleTextEditor';
import { Content } from '../../utils/types';
import { v4 as uuidv4 } from 'uuid';






const Gallery = () => {
	const [selectedMedia, setSelectedMedia] = useState<[string, string] | [] >([]);
	const [selectedItemId, setSelectedItemId] = useState<string>("");
	const [loadedContent, setLoadedContent] = useState<Content[]>([])
	const [isEditOptionsVisible, showEditOptions] = useState<boolean>(false);	
	const [isMediaGalleryVisible, showMediaGallery] = useState<boolean>(false);
	const [isEditMade, setEditMade] = useState<boolean>(false);
	const [isLinkEditorVisible, showLinkEditor] = useState<boolean>(false);
	const [savedContent, setSavedContent] = useState<Content[]>([]);

		
	useEffect(() => {
	fetch('/api/get-gallery-content')
            .then(response => response.json())
            .then(data => {
                setLoadedContent(data);
            });
    }, [savedContent]);

	const addComponent = (kind: 'Media Info Card' | 'Simple Text Editor' | 'Media Info Card: Press') => {
		const newId = uuidv4();
		if (kind === 'Media Info Card') {
			setLoadedContent(currentComponents => [
				...currentComponents, 
				{ section_id: 'p&s: illustrations', connection_id: newId, title: "", description: "", src: "", alt: "", link: "", action: "new" }
			]);
		} else if (kind === 'Media Info Card: Press') {
			setLoadedContent(currentComponents => [
				...currentComponents,
				{ section_id: 'press', connection_id: newId, title: "", description: "", src: "", alt: "", link: "", action: "new" }
			]);

		} else if (kind === 'Simple Text Editor'){
			setLoadedContent(currentComponents => [
				...currentComponents,
				{section_id: 'clients', connection_id: newId, title: '', description: '', src: '', alt: '', link: '', action: 'new'}
			]);
		}
	};

	const updateComponent = (updatedData: Content[]) => {
			setLoadedContent(updatedData);
			setEditMade(true);		
		};


	const deleteComponent = (unique_id: string, section_id: 'illustrations' | 'p&s: illustrations' | 'p&s: posters' | 'p&s: 2d animation & motion graphics' | 'p&s: character design' | 'clients' | '') => {
	setEditMade(true);
	setLoadedContent(currentContent => {
			const indexToDelete = currentContent.findIndex(component => component.connection_id === unique_id);
			console.log('index to delete: ', indexToDelete);
			if (indexToDelete === -1) {
            return currentContent;
        }

		const newItem: Content = {
			section_id: section_id,
			connection_id: unique_id,
			title: '',
			description: '', 
			src: '',
			alt: '',
			link: '',
			action: 'delete'
		};

		console.log('new item created:', newItem);

		return  [
				...currentContent.slice(0, indexToDelete),
				newItem,
				...currentContent.slice(indexToDelete + 1)
				]
		});
		}

	const handleMediaSelected = (mediaSelected: [string, string]) => {
			setSelectedMedia(mediaSelected);
		}

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
	setEditMade(true);
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
			const result = await updateContent(changes);
			setEditMade(false);
			setSavedContent(changes);
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
			{loadedContent
			.filter(slot => slot.section_id === 'illustrations')
			.map(slot  => ( 
				<ImageSlot
					key={slot.connection_id}
					src={slot.src}
					alt={slot.alt}
					link={slot.link}
					setSelectedId={handleItemSelection}
					connection_id={slot.connection_id}
					/>
				))}
		</ToggleWindow>
		<ToggleWindow title="Products & Services" rows={3} behavior="additive" >

		{/*Map through the loadedContent to generate MediaInfoCard components */} 

		<button onClick={() => addComponent('Media Info Card')}> Add </button>

		{loadedContent.filter(component => ( 
			component.section_id === 'p&s: illustrations' || 
			component.section_id === 'p&s: 2d animation & motion graphics' || 
			component.section_id === 'p&s: character design' &&
			component.action !== 'delete'))
			.map(component => (
				<MediaInfoCard key={component.connection_id} 
				initialData={component} 
				setSelectedId={handleItemSelection} 
				updateParent={updateComponent} 
				deleteThis={deleteComponent} 
				parentComponent={loadedContent}
				options="p&s"
				/>
			))
		}

		</ToggleWindow>


		<ToggleWindow title="Clients" rows={3} behavior="additive">
		
		<button onClick={() => addComponent('Simple Text Editor')}> Add </button>
			{loadedContent.filter (component => (
				component.section_id === 'clients' &&
				component.action !== 'delete'))
				.map(component => (
			<SimpleTextEditor key={component.connection_id}
				parentComponent={loadedContent}
				initialData={component}
				connection_id={component.connection_id}
				onItemsUpdate={updateComponent} 
				parts='DS'
				type='solo'
				deleteThis={deleteComponent}
				/> )) 
			}

		</ToggleWindow>
		{isEditMade && <button onClick={() => handleSaveChanges(loadedContent)}>Save Changes</button>}
		
		<ToggleWindow title="Press" rows={3} behavior="additive">

		{loadedContent.filter(component => ( 
			component.section_id === 'press' && 
			component.action !== 'delete'))
			.map(component => (
				<MediaInfoCard key={component.connection_id} 
				initialData={component} 
				setSelectedId={handleItemSelection} 
				updateParent={updateComponent} 
				deleteThis={deleteComponent} 
				parentComponent={loadedContent}
				options="press"
				/>
			))
		}	


		<button onClick={() => addComponent('Media Info Card: Press')}> Add </button>

		</ToggleWindow>

	</div>
	)
}

export default Gallery;
