'use client'
import React, {useState} from 'react'; 
import styles from '../styles/SimpleTextEditor.module.scss';
import { Content } from '../utils/types';

interface SimpleTextEditorProps {
	component: Content;
	connection_id: string;
	onItemsUpdate: Function;
	size: number;
}

const SimpleTextEditor = ({component, connection_id, onItemsUpdate, size}: SimpleTextEditorProps) => {


	const [title, setTitle] = useState<string | undefined>(component.title);
	const [description, setDescription] = useState<string | undefined >(component.description);
	const [subtitle, setSubtitle] = useState<string | undefined>(component.subtitle);


	
	
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		if (name === 'title'){
			setTitle(event.target.value);
		} else if (name === 'description'){
			setDescription(event.target.value);
		} else if (name === 'subtitle') {
			setSubtitle(event.target.value);
		}
	}

		const handleButtonClick = () => {
			const changedComponent = { title: title, description: description, subtitle: subtitle };
			onItemsUpdate(changedComponent);
	}

	return (
		<div id={styles.simpleTextEditor}>	
			{ size >= 1 &&
			<input type="text" name="title" placeholder="Enter title" value={title} onChange={handleInputChange} /> 
			}{ size >= 2 &&
			<input type="text" name="description" placeholder="Enter description" value={description} onChange={handleInputChange}/> 
			}{ size >= 3 &&
			<input type="text" name="subtitle" placeholder="Enter subtitle" value={subtitle} onChange={handleInputChange} /> 
			}
			<button onClick={handleButtonClick}> Update Text</button>

		</div>

	)
}

export default SimpleTextEditor;
