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
				<form action="/api/login/password" method="post"> 
					<label htmlFor="username"></label>Username:<br/>
					<input type="text" id="username" name="username" required autoFocus/><br/>
					<label htmlFor="current-password"> Password:</label><br/>
					<input type="password" id="current-password" autoComplete="current-password" name="password" required /><br/>
					<button type="submit"> Sign In</button>
				</form>
			</div>
			</div>
		)
}

export default Homepage;
