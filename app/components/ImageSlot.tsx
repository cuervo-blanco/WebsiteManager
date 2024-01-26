import React, {useState, useEffect, useRef} from 'react';
import styles from '../styles/ImageSlot.module.scss';
import { ImageSlotProps } from '../utils/types';

const ImageSlot = ({src, alt, setSelectedId, connection_id}: ImageSlotProps) => {
	
	return(
	<div id={styles.imageSlotContainer} onClick={() => setSelectedId(connection_id)}>
			<img src={src} alt={alt}></img>
		</div>
	)
}

export default ImageSlot;
