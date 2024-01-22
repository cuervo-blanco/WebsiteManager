import  React from 'react';
import styles  from '../styles/SelectWindow.module.scss';


const SelectWindow = ({select}) => {
	return(
	<div id={styles.selectWindowContainer}>
		<ul>
			<li>edit link</li>
			<li onClick={select}>edit image</li>
		</ul>
	</div>
	)
}

export default SelectWindow;
