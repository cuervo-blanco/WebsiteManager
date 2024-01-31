import React, {useState, useEffect, useRef} from 'react';
import styles from '../styles/ImageSlot.module.scss';
import { ImageSlotProps } from '../utils/types';

const ImageSlot = ({src, alt, setSelectedId, connection_id, section_id, deleteThis, type}: ImageSlotProps) => {


		const handleSendId = () => {
			setSelectedId(connection_id)
		}

		const imageSlotStyle = () => {
			if (type === 'illustration') {
				return	{height: '200px'}
				} else if (type === 'poster'){
				return {height: '296px'}
			}
			return {}
			
		}
	
	return(
	<div id={styles.imageSlotContainer}  style={imageSlotStyle()}>
			<img src={src} alt={alt} onClick={handleSendId}></img>
			{type === 'poster' && 	<button onClick={() => deleteThis(connection_id, section_id)}>Delete</button>
}
		</div>
	)
}

export default ImageSlot;
