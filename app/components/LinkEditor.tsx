'use client';
import React, { useState, useEffect } from 'react';
import styles from '../styles/LinkEditor.module.scss';
import { Content, LinkEditorProps, Item} from '../utils/types';


const LinkEditor: React.FC<LinkEditorProps> = ( {items, connection_id, onItemsUpdate} ) => {

	const [link, setLink] = useState(''); 

	const findItemById = (items: Content[], id: string | undefined): Item | undefined => {

		if (id === undefined) {
			return undefined;
		}

		return items.find(item => item.connection_id === id);

	};
	
	useEffect(() => {
	const selectedItem = findItemById(items, connection_id);
		if(selectedItem && selectedItem.link) {
			setLink(selectedItem.link);
		} else {
			setLink ('');
		}
	}, [items, connection_id]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLink(event.target.value);
	}

	const handleButtonClick = () => {
		//Find the item by ID, update its link property
//Use onItemsUpdate to send the updated items back to the parent component
		
		const indexToUpdate = items.findIndex(item => item.connection_id === connection_id);
		if(indexToUpdate !== -1) {
			const updatedImages = [
				...items.slice(0, indexToUpdate),
				{... items[indexToUpdate], link: link },
				...items.slice(indexToUpdate + 1)
		];
		//Update the state with the new array
		onItemsUpdate(updatedImages);
	}
			
	}

	return (
		<div id={styles.linkEditorContainer}>
			<input type="text" placeholder="Enter Link" value={link} onChange={handleInputChange} ></input>
			<button onClick={handleButtonClick}> Update Link </button>
		</div>
	)
}


export default LinkEditor;
