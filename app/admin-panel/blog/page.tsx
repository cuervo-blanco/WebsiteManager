'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/blog.module.scss';

const Blog = () => {

const router = useRouter();

	return(
	<div id={styles.blogContainer}>
		<h1>Welcome to the blog manager!</h1>
	<button type="button" onClick={() => router.push('/admin-panel/blog/editor?post=new')}>Add Post</button>
	</div>
	)
}

export default Blog;
