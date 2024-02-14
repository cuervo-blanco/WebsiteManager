import  React from 'react';
import styles  from '../styles/SelectWindow.module.scss';


const SelectWindow = ({select, editLink, hasLink }) => {
	return(
	<div id={styles.selectWindowContainer}>
		<ul>

{hasLink &&			<li onClick={editLink}>edit link</li> }
			<li onClick={select}>edit image</li>
		</ul>
	</div>
	)
}

export default SelectWindow;
