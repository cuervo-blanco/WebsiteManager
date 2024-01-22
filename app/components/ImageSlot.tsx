import React, {useState, useEffect, useRef} from 'react';
import styles from '../styles/ImageSlot.module.scss';
import { ImageSlotProps } from '../utils/types';

const ImageSlot = ({src, alt, link, select, connectionId}: ImageSlotProps) => {
	
	return(
	<div id={styles.imageSlotContainer} onClick={() => select(connectionId)}>
			<img src={src} alt={alt}></img>
		</div>
	)
}

export default ImageSlot;
