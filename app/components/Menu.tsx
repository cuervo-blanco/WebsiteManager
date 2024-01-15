'use client';
import React, { useEffect, useState } from 'react'; 
import styles from '../styles/Menu.module.scss';

const Menu = () => {
		
		const [menuItems, setMenuItems] = useState([]);

	useEffect(() => {
        fetch('/api/menu-items')
            .then(response => response.json())
            .then(data => {
                const items = data.map(item => <li key={item.page_id}><a href={'/admin-panel/' + item.page_type_name}>{item.page_title}</a></li>); // Assuming 'id' and 'name' are properties of the items
                setMenuItems(items);
            });
    }, []);

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
		<ul><li><a href="/admin-panel">Dashboard</a></li>{menuItems}<li ><a href="/admin-panel/settings" >Settings</a></li></ul>
		<button onClick={handleLogout}>Log Out</button>
		</div>
	)

}



export default Menu;
