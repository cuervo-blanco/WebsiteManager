import React from 'react';
import styles from '../../styles/media.module.scss';
import FileUploader from '../../components/fileUploader';
import MediaViewer from '../../components/MediaViewer';




const Media = () => {
	return(
	<div id={styles.mediaContainer}>
		<h1>Welcome to the Media Uploader!</h1>
		<h4>Add pictures, documents, videos and audios for later use in your website</h4>
		<FileUploader />
		<MediaViewer sendSelect={null} modalWindow={false}/>

	</div>	
	)
}

export default Media;
