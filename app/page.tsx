import React from 'react';
import styles from './styles/homepage.module.scss';
import LogWindow from './components/LogWindow';


const Homepage = () => {


		
		
		return (
			<div id={styles.homepageContainer}>
				<h1>My Website Manager</h1>
				<div id={styles.formContainer}>
	
				<LogWindow />

				</div>
				</div>
	)
}



export default Homepage;
