import  React from 'react';
import styles  from '../styles/SelectWindow.module.scss';


const SelectWindow = ({select, editLink}) => {
	return(
	<div id={styles.selectWindowContainer}>
		<ul>
			<li onClick={editLink}>edit link</li>
			<li onClick={select}>edit image</li>
		</ul>
	</div>
	)
}

export default SelectWindow;
