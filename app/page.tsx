import React from 'react';
import Image from 'next/image';
import styles from './styles/homepage.module.scss';
import logo from  '../public/logo.png';

const Homepage = () => {

		return (
			<div id={styles.homepageContainer}>
			<h1>My Website Manager</h1>
			<div id={styles.formContainer}>
				<Image id={styles.logoImage} src={logo} alt="logo little boy with hammer"/>
				<form action="/api/login"> 
					<label htmlFor="user-id"></label>User ID:<br/>
					<input type="text" id="user-id" name="user-id"/><br/>
					<label htmlFor="access-key"> Access Key:</label><br/>
					<input type="text" id="access-key" name="access-key"/><br/>
					<input type="submit"/>
				</form>
			</div>
			</div>
		)
}

export default Homepage;
