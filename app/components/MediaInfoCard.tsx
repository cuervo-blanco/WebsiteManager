'use client'
import React, { useState } from 'react';
import ImageSlot from './ImageSlot';
import SimpleTextEditor from './SimpleTextEditor';
import styles from '../styles/MediaInfoCard.module.scss';
import { Content, SetStateFunction } from '../utils/types';


interface MediaInfoProps {
	initialData: Content;
	updateParent: Function;
	setSelectedId: (selectedId: string) => void;
	parentComponent: Content[];
	deleteThis: (connection_id: string, section_id: 'illustrations' | 'p&s: illustrations' | 'p&s: posters' | 'p&s: 2d animation & motion graphics' | 'p&s: character design' | 'clients' | '') => void;
	}



const MediaInfoCard = ({initialData, updateParent, setSelectedId, parentComponent, deleteThis }: MediaInfoProps) => {

	const [selectedCategory, setSelectedCategory] = useState(initialData.section_id);
	const [backgroundColor, setBackgroundColor]  = useState<string>('white')


	const categories = [
        { label: 'Illustrations', value: 'p&s: illustrations' },
        { label: '2D Animation & Motion Graphics', value: 'p&s: 2d animation & motion graphics' },
        { label: 'Character Design', value: 'p&s: character design' }
    ];

	const handleSelection = (value) => {
		if (value ===  'p&s: illustrations') {
			setBackgroundColor('white');
		} else if (value ===  'p&s: posters')  {
			setBackgroundColor('green');
		} else if (value ===  'p&s: 2d animation & motion graphics') {
			setBackgroundColor('blue');
		} else if (value ===  'p&s: character design') {
			setBackgroundColor('yellow');
		}
        setSelectedCategory(value);
		processSelection(value);

    };

	const processSelection = (category) => {
		const changedComponent = { section_id: category };
		updateComponent(changedComponent);
    };

	const updateComponent = (changedComponent) => {
		const indexToUpdate = parentComponent.findIndex(component => component.connection_id === initialData.connection_id);
		if(indexToUpdate !== -1) {
			const updatedComponent = [
				...parentComponent.slice(0, indexToUpdate),
				{... parentComponent[indexToUpdate], ...changedComponent },
				...parentComponent.slice(indexToUpdate + 1)
			];
			updateParent(updatedComponent);
		}	
	}

	return (
		<div id={styles.mediaInfoCardContainer} style={{backgroundColor: backgroundColor}}>

		<div id={styles.radioButtons}>{categories.map((category, index) => (
                <label key={index}>
                    <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={selectedCategory === category.value}
                        onChange={() => handleSelection(category.value)}
                    />
                    {category.label}
                </label>
            ))}
		</div>

		{/*Use this input to change section_id limit the sections to the sections where the media info card is placed and also change the color based on the section.*/}
			<ImageSlot src={initialData.src}
			alt={initialData.alt}
			setSelectedId={setSelectedId}
			connection_id={initialData.connection_id} 
			link={initialData.link}/>

			<SimpleTextEditor parentComponent={parentComponent}
			initialData={initialData}
			connection_id={initialData.connection_id}
			onItemsUpdate={updateComponent} 
			parts='TD' 
			type='dependent'/>

			<button onClick={() => deleteThis(initialData.connection_id, initialData.section_id)}>Delete</button>
			</div>
	)
}

export default MediaInfoCard;
