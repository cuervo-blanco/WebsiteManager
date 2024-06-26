import React from 'react';
import styles from '../styles/ToggleWindow.module.scss';
import { WindowProps } from '../utils/types'


const ToggleWindow = ({children, title, rows, behavior }: WindowProps) => {

	return(
		<div id={styles.toggleWindowContainer}>
			<div id={styles.windowTitle}>
				<h1>{title}</h1>
			</div>
			<div id={styles.windowContent}>
				{children}
			</div>
		</div>
	)
}

export default ToggleWindow;
