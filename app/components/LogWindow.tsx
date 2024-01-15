'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from  '../../public/logo.png';
import styles from '../styles/LogWindow.module.scss';

const LogWindow = () => {


const [logStatus, changeLogStatus ] =  useState(false);

useEffect(() => {
  fetch('/api/auth-check')
  .then(response => response.json())
  .then(data => {
	changeLogStatus(data);
	})
  }, []);

	return (

	<div id={styles.logWindowContainer}>
				<Image id={styles.logoImage} src={logo} alt="logo little boy with hammer"/>
				 {!logStatus && <form action="/api/login/password" method="post"> 
					<label htmlFor="username"></label>Username:<br/>
					<input type="text" id="username" name="username" required autoFocus/><br/>
					<label htmlFor="current-password"> Password:</label><br/>
					<input type="password" id="current-password" autoComplete="current-password" name="password" required /><br/>
					<button type="submit"> Sign In</button>
				</form>} 
				{logStatus && <div> You're authenticated man</div>}
	</div>
	)
}

export default LogWindow;
