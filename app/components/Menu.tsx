'use client';
import React from 'react'; 
import styles from '../styles/Menu.module.scss';

const Menu = () => {

		const handleLogout = () => {
		fetch('/api/logout', { method: 'POST' })
		.then(response => {
		if (response.ok){
			window.location.href = '/';
		} else {
			console.error('Logout failed');
		}
		})
		.catch(error => console.error('Error:', error));
		}



	return (
		
		<div id={styles.menuContainer}>
		<button onClick={handleLogout}>Log Out</button>
		</div>
	)

}



export default Menu;
