'use client';
import React from 'react';
import ImageSlot from './ImageSlot';
import SimpleTextEditor from './SimpleTextEditor';
import styles from '../styles/MediaInfoCard.module.scss';

const MediaInfoCard = () => {

	//Component needs to fetch data from the parent component 

	return (
		<div id={styles.mediaInfoCardContainer}>
			<ImageSlot src={undefined} alt={undefined} link={undefined} select={undefined} connection_id={undefined}/>
			<SimpleTextEditor title={undefined} connection_id={undefined} section_id={undefined}/>
		</div>
	)
}

export default MediaInfoCard;
