'use client';
import React from 'react';
import styles from '../styles/ImageBlock.module.scss';

interface ImageBlock {
	id: string;
	imgUrl: string;
	imgAlt: string;
	select: Function;
    modalView: boolean;
}

const ImageBlock = ({id, imgUrl, imgAlt, select, modalView}: ImageBlock) => {

    const modalStyle = modalView ? styles.smallView : styles.largeView;


	return (
	<div id={styles.imageBlockContainer} className={`${modalStyle}`} onClick={() => select(imgUrl, imgAlt)} >
	<img id={id} src={imgUrl} alt={imgAlt}></img>
	</div>
	)
}

export default ImageBlock;
