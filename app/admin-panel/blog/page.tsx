'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/blog.module.scss';
import { getPostList, deletePost } from '../../utils/fileUploadUtils';
import {BlogPost} from '../../utils/types';

const Blog = () => {

const router = useRouter();

    const [postList, setPostList] = useState<BlogPost[]>([]);
    const [refreshFlag, setRefreshFlag] = useState(false);


    const handlePostDelete = async (post_id) => {
        // make server request to delete post
        try {
            const result = await deletePost(post_id);
            console.log('Post was successfully deleted', result);
            // Trigger refresh
            setRefreshFlag(prevFlag => !prevFlag);
        } catch (error) {
            console.error('Error deleting post', error);
        }
    }

useEffect(() => {
    const fetchPosts = async () => {
        try {
            const fetchedPostList = await getPostList();
                console.log('Received post list:', fetchedPostList);
                setPostList(fetchedPostList);

            } catch (error) {
                console.error('Error fetching posts:', error);
                setPostList([]);
            }
        };
        fetchPosts();
    }, [refreshFlag])

    const editPost = (id: string) => {
        const postToEdit = postList.find(post => post.post_id === id);
        sessionStorage.setItem('postToEdit', JSON.stringify(postToEdit));
        router.push(`/admin-panel/blog/${id}`);
    }

    return(
        <div id={styles.blogContainer}>
            <h1>Welcome to the blog manager!</h1>
            <button type="button" onClick={() => router.push('/admin-panel/blog/new')}>Add Post</button>
            { postList && postList.length > 0 && postList.map((post, index) => (
                <div key={`post${index}`} className={styles.postListItem}>
                    <h1>{post.draft_version.title}</h1>
                    <p>{post.draft_version.description}</p>
                    <p>Status: {post.status}</p>
                    <p>Author: {post.author}</p>
                    <button onClick={() => editPost(post.post_id)}>Edit</button>
                    <button onClick={() => handlePostDelete(post.post_id)}>Delete</button>
                </div>
            ))}
	</div>
	)
}

export default Blog;
