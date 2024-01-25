'use client'
import React from 'react'; 
import styles from '../styles/SimpleTextEditor.module.scss';

const SimpleTextEditor = ({title, description, subtitle, published_date }) => {
	return (
		<div id={styles.simpleTextEditor}></div>
	)
}

export default SimpleTextEditor;
