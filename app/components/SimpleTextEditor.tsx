'use client'
import React, {useState} from 'react'; 
import styles from '../styles/SimpleTextEditor.module.scss';
import { Content } from '../utils/types';

interface SimpleTextEditorProps {
	parentComponent: Content[];
	initialData: Content;
	connection_id: string;
	onItemsUpdate: Function;
	parts: 'all' | 'TD' | 'DS'; 
	type: 'solo' | 'dependent';
	deleteThis:  (connection_id: string, section_id: 'illustrations' | 'p&s: illustrations' | 'p&s: posters' | 'p&s: 2d animation & motion graphics' | 'p&s: character design' | 'clients' | '') => void;
}

const SimpleTextEditor = ({parentComponent, initialData, connection_id, onItemsUpdate,  parts, type, deleteThis}: SimpleTextEditorProps) => {


	const [title, setTitle] = useState<string | undefined>(initialData.title);
	const [description, setDescription] = useState<string | undefined >(initialData.description);
	const [subtitle, setSubtitle] = useState<string | undefined>(initialData.subtitle);	
	
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		if (name === 'title'){
			setTitle(event.target.value);
		} else if (name === 'description' ){
			setDescription(event.target.value);
		} else if (name === 'subtitle') {
			setSubtitle(event.target.value);
		}
	}

		const handleButtonClick = () => {
		if (type === 'dependent') {
			const changedComponent = { title: title, description: description, subtitle: subtitle };
			onItemsUpdate(changedComponent);
		} else if (type === 'solo') {

		const changedComponent = {...initialData, title: title, description: description, subtitle: subtitle };
		
		const indexToUpdate = parentComponent.findIndex(component => component.connection_id === initialData.connection_id);
				if(indexToUpdate !== -1) {
				const updatedComponent = [
				...parentComponent.slice(0, indexToUpdate),
				{... parentComponent[indexToUpdate], ...changedComponent },
				...parentComponent.slice(indexToUpdate + 1)
				];	
				onItemsUpdate(updatedComponent);
			};
		}
	}

	return (
		<div id={styles.simpleTextEditor}>	
			{ parts === 'all' || parts === 'TD' && 
			<input type="text" name="title" placeholder="Enter title" value={title} onChange={handleInputChange} /> 
			}{parts === 'all' || parts === 'TD' || parts === 'DS' && 
			<input type="text" name="description" placeholder="Enter description" value={description} onChange={handleInputChange}/> 
			}{ parts === 'all' || parts === 'DS' &&
			<input type="text" name="subtitle" placeholder="Enter subtitle" value={subtitle} onChange={handleInputChange} /> 
			}
			<button onClick={handleButtonClick}> Update Text</button>

			{type === 'solo' && <button onClick={() => deleteThis(initialData.connection_id, initialData.section_id)}>Delete</button>
}

		</div>

	)
}

export default SimpleTextEditor;
