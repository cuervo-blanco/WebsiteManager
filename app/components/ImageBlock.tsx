'use client';
import React from 'react';
import styles from '../styles/ImageBlock.module.scss';

interface ImageBlock {
	id: string;
	imgUrl: string;
	imgAlt: string;
	select: Function;
}

const ImageBlock = ({id, imgUrl, imgAlt, select}: ImageBlock) => {


	return (
	<div id={styles.imageBlockContainer} onClick={() => select(imgUrl, imgAlt)} > 
	<img id={id} src={imgUrl} alt={imgAlt}></img>
	</div>
	)
}

export default ImageBlock;
