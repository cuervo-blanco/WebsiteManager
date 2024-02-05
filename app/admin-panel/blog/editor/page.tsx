'use client';
import React, { useEffect, useState, useRef} from 'react';
import styles from '../../../styles/editor.module.scss';
import { Editor } from '@tinymce/tinymce-react';
import tinymce from 'tinymce';
import { useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { saveBlogPost } from '../../../utils/fileUploadUtils'

type BlogPost = {
post_id: string,
draft_version: {
  title: string,
  description: string,
  body: string,
  slug: string,
  tags: string,
  featured_image: string
},
published_version: string,
published_date: string,
author: string,
status: string,
seo_metadata: {}
}

const BlogEditor = () => {
		
	// States: used to store the values the user will be changing
	const [postTitle, setPostTitle] = useState<string>('');
	const [postBody, setPostBody] = useState<string>('');
	const [postDescription, setPostDescription] = useState<string>('');
	const [postTags, setPostTags] = useState<string>('');
	const [editorInitialized, setEditorInitialized] = useState(false);
	const [editMade, setEditMade] = useState(false);
	const [changesSaved, setChangesSaved] = useState(false);
	const [postStatus, setPostStatus] = useState<string>('');
	const [postAuthor, setPostAuthor] = useState<string>('' );
	const [postId, setPostId] = useState<string>('');
	const [postDate, setPostDate] = useState<string | ''>('');
	const [postMetaData, setPostMetaData] = useState<{} | ''>('');
	const [featuredImage, setFeaturedImage] = useState<string>('');

	// Getting the url query to identify if the post is new or if it should be fetched.
	const searchParams = useSearchParams();
	const post = searchParams.get('post');

	const currentPostState = useRef({});

	// Change a title to a slug
	const titleToSlug = (title: string | undefined) => {
		if (title !== undefined) {
		return title
		.toLowerCase()
		.replace(/[^\w\s]/gi, '')
		.trim()
		.replace(/\s+/g, '-')
		}
		return '';
	}

	// Load Post data function. 
		const loadPostData = async () => {
			try {
				const response = await fetch(`/api/blog/editor/${post}`)
				const postData = await response.json();
			
					setPostBody(postData.draft_version.body);
					setPostTitle(postData.draft_version.title);
					setPostDescription(postData.draft_version.description);
					setPostTags(postData.draft_version.tags);
					setPostAuthor(postData.author);
					setPostStatus('edit');			
					setPostId(postData.post_id);
					setPostDate(postData.published_date);
					setPostMetaData(postData.seo_metadata);

					return postData;
			} catch (error) {
				console.error('Error loading post data:', error);
			}
		}

	// useEffect for loading data annd initializing states

	useEffect(() => {
		if (post === 'new'){
			// Initialize post states	
			setPostStatus('draft');
			const newPostId = uuidv4();
			setPostId(newPostId);

		} else {
			loadPostData();	
		}
	}, [post]);
	
	// useEffect for initializing Session Storage and handling the unmount and recall of the post data

	useEffect(() => {
		// Create a session storage key and store the current states
		const saveStateToSessionStorage = () => {
			sessionStorage.setItem('blogPostState', JSON.stringify(currentPostState.current));
		}
		
		currentPostState.current = {
			post_id: postId,
			draft_version: {
				title: postTitle,
				description: postDescription,
				body: postBody,
				tags: postTags,
				featured_image: featuredImage
			},
			author: postAuthor,
			seo_metadata: postMetaData,
			status: postStatus
		}

		window.addEventListener('beforeunload', saveStateToSessionStorage);

		setEditorInitialized(false);
	
		return () => {
			// Clean up the event listener and save the state to the Storage
			window.removeEventListener('beforeunload', saveStateToSessionStorage);
			saveStateToSessionStorage();
		}

		}, [postId, postTitle, postDescription, postBody, postDate, postTags, postStatus, postAuthor, postMetaData]);


	// Handle changes en save to states
	const handleEditorChange = (content) => {
		setPostBody(content);
		setEditMade(true);
	};
	const handleTitleChange = (event) => {
		setPostTitle(event.target.value);
	};
	const handleDescriptionChange = (event) => {
		setPostDescription(event.target.value);
	}	
	const handleChangeAuthor = (event) => {
		setPostAuthor(event.target.value);		
	}

	const handleSaveChanges = async () => {
		try {
			const postSlug = titleToSlug(postTitle);
			const postToSave: BlogPost = {
				post_id: postId,
				draft_version: {
					title: postTitle,
					description: postDescription,
					body: postBody,
					slug: postSlug,
					tags: postTags,
					featured_image: featuredImage
				},
				published_date: postDate,
				author: postAuthor, 
				status: postStatus || 'undefined',
				seo_metadata: postMetaData
			}

			const result = await saveBlogPost(postToSave);
			setEditMade(false);
			setChangesSaved(true);
		} catch (error) {
			console.error('Error during post upload:', error);
			setEditMade(true);
		  }
	}

	return(
	<div id={styles.blogContainer} >

	<h1>Welcome to the blog editor!</h1>

	<p>This is the post: {post}</p>


	<input 
		type="text"
		value={postTitle}
		onChange={handleTitleChange}
		placeholder="Post Title"
		/>

	<input 
		type="text"
		value={postDescription}
		onChange={handleDescriptionChange}
		placeholder="Post Description"
		/>

		<Editor
      apiKey='gx7vxizmmpdc7eqc9kz4jnxgq84b9dyjkd67jd0j8vi63was'
      init={{
        plugins: 'ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
      }}
		initialValue={editorInitialized ? undefined : postBody}
		onInit={() => {
			// Set the flag to true once the editor is initialized
			setEditorInitialized(true);
		}}
		onEditorChange={handleEditorChange}
		/>
		<label>Author: </label>
		<select	id="author" onChange={handleChangeAuthor}>
			<option value="lucia-castro">Lucía Castro</option>
		</select>

		{editMade && <button onClick={handleSaveChanges}>Save Changes</button>}
		{changesSaved && <button>Publish</button>}
		

	</div>
	)
}

export default BlogEditor;
