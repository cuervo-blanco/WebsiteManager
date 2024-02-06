'use client';
import React, { useEffect, useState, useRef} from 'react';
import styles from '../../../styles/editor.module.scss';
import { Editor } from '@tinymce/tinymce-react';
import tinymce from 'tinymce';
import { useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { saveBlogPost } from '../../../utils/fileUploadUtils'
import { produce } from "immer";

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
	const [editorInitialized, setEditorInitialized] = useState(false);
	const [editMade, setEditMade] = useState(false);
	const [changesSaved, setChangesSaved] = useState(false);
	const [postState, setPostState] = useState<BlogPost>({
		post_id: '',
		draft_version: {
			title: '',
			description: '',
			body: '',
			slug: '',
			tags: '',
			featured_image: ''
		},
		published_version: '',
		published_date: '',
		author: '',
		status: '',
		seo_metadata: {}
	})

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
			
					setPostState(currentData => produce(currentData, draft => {
						draft.post_id = postData.post_id;
						draft.draft_version.title = postData.draft_version.title;
						draft.draft_version.body = postData.draft_version.body;
						draft.draft_version.description = postData.draft_version.description;
						draft.draft_version.tags = postData.draft_version.tags;
						draft.draft_version.featured_image = postData.draft_version.featured_image;
						draft.draft_version.slug = postData.draft_version.slug;
						draft.author = postData.slug;
						draft.published_date = postData.published_date;
						draft.status = postData.author;
						draft.published_version = postData.published_version;
						draft.seo_metadata = postData.seo_metadata;
					}));

					return postData;
			} catch (error) {
				console.error('Error loading post data:', error);
			}
		}

	// useEffect for loading data annd initializing states

	useEffect(() => {
		if (post === 'new'){
			// Initialize post states	
			const newPostId = uuidv4();

			setPostState(currentData=> produce(currentData, draft => {
				draft.post_id = newPostId;
				draft.status = 'draft'
			}))

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
			post_id: postState.post_id,
			draft_version: {
				title: postState.draft_version.title,
				description: postState.draft_version.description,
				body: postState.draft_version.body,
				tags: postState.draft_version.tags,
				featured_image: postState.draft_version.featured_image
			},
			author: postState.author,
			seo_metadata: postState.seo_metadata,
			status: postState.status
		}

		window.addEventListener('beforeunload', saveStateToSessionStorage);

		setEditorInitialized(false);
	
		return () => {
			// Clean up the event listener and save the state to the Storage
			window.removeEventListener('beforeunload', saveStateToSessionStorage);
			saveStateToSessionStorage();
		}

		}, [postState]);

			
	// Handle changes en save to states

	const handleChange = (event, stateToChange) => {
		setEditMade(true);
		switch (stateToChange) {
			case 'title':
				setPostState(currentData => produce(currentData, draft => { draft.draft_version.title = event.target.value}));
				break;
			case 'description':
				setPostState(currentData => produce(currentData, draft => { draft.draft_version.description = event.target.value}));
				break;
			case 'body':
				setPostState(currentData => produce(currentData, draft => { draft.draft_version.body = event.target.value}));
				break;
			case 'author':
				setPostState(currentData => produce(currentData, draft => { draft.author = event.target.value}));
				break;
			case 'tags':
				setPostState(currentData => produce(currentData, draft => { draft.draft_version.tags = event.target.value}));
				break;
			default:
				console.log('No state property was chosen');
				break;
		}
	}
const handleSaveChanges = async () => {
		try {
			const postSlug = titleToSlug(postState.draft_version.title);
			const postToSave: BlogPost = {
				post_id: postState.post_id,
				draft_version: {
					title: postState.draft_version.title,
					description: postState.draft_version.description,
					body: postState.draft_version.body,
					slug: postSlug,
					tags: postState.draft_version.tags,
					featured_image: postState.draft_version.featured_image
				},
				published_version: postState.published_version,
				published_date: postState.published_date,
				author: postState.author, 
				status: postState.status,
				seo_metadata: postState.seo_metadata
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
		value={postState.draft_version.title}
		onChange={e => handleChange(e, 'title')}
		placeholder="Post Title"
		/>

	<input 
		type="text"
		value={postState.draft_version.description}
		onChange={e => handleChange(e, 'description')}
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
		initialValue={editorInitialized ? undefined : postState.draft_version.body}
		onInit={() => {
			// Set the flag to true once the editor is initialized
			setEditorInitialized(true);
		}}
		onEditorChange={e => handleChange(e, 'body')}
		/>
		<label>Author: </label>
		<select	id="author" onChange={e => handleChange(e, 'author')}>
			<option value="lucia-castro">Lucía Castro</option>
		</select>

		{editMade && <button onClick={handleSaveChanges}>Save Changes</button>}
		{changesSaved && <button>Publish</button>}
		

	</div>
	)
}

export default BlogEditor;
