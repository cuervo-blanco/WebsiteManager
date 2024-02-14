'use client';
import React, { useEffect, useState } from 'react';
import styles from '../../../styles/editor.module.scss';
import { useSearchParams, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { saveBlogPost, getPost, publishBlogPost } from '../../../utils/fileUploadUtils'
import { BlogPost, DraftVersionKeys } from '../../../utils/types';
import { produce } from "immer";
import { Editor } from '@tinymce/tinymce-react';
import MediaViewer from '../../../components/MediaViewer';
import ImageSlot from '../../../components/ImageSlot';
import SelectWindow from '../../../components/SelectWindow';


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


const BlogEditor = ({
    params } : {
        params: { post_id: string };
    }) => {

    const editorKey = process.env.NEXT_PUBLIC_TINY_MCE_EDITOR_KEY;
    const router = useRouter();

	// States: used to store the values the user will be changing
	const [editorInitialized, setEditorInitialized] = useState(false);
	const [editMade, setEditMade] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [isImageSlotSelected, setImageSlotSelected] = useState(false);
	const [changesSaved, setChangesSaved] = useState(false);
    const [showMediaGallery, setShowMediaGallery] = useState<boolean>(false);
    const [selectedMedia, setSelectedMedia] = useState(['',''])
    const [editorRef, setEditorRef] = useState(null);
    const [isEditOptionsVisible, showEditOptions] = useState<boolean>(false);
	const [postState, setPostState] = useState<BlogPost>({
		post_id: '',
		draft_version: {
			title: '',
			description: '',
			body: '',
			slug: '',
			tags: [''],
			featured_image: '',
		},
		published_version: '',
		published_date: '',
		author: '',
		status: '',
		seo_metadata: {}
	})
    const [isClient, setIsClient] = useState(false);

    /////////----------- SESSION STORAGE METHODS ----------------/////////////
    const getSessionStorageKey = (id: string) => `blogPostState_${id}`;

    const loadStateFromSessionStorage = (id: string) => {
        const savedState = sessionStorage.getItem(getSessionStorageKey(id));
        return savedState ? JSON.parse(savedState) : null;
    }

    const saveStateToSessionStorage = (id: string, state: BlogPost) => {
        sessionStorage.setItem(getSessionStorageKey(id), JSON.stringify(state));
    };

	// Load Post data function.
		const loadPostData = async () => {
			try {
				// const postData: BlogPost = await getPost(id);
                const postData = JSON.parse(sessionStorage.getItem('postToEdit'));

					setPostState(currentData => produce(currentData, draft => {
						draft.post_id = postData.post_id;
						draft.draft_version.title = postData.draft_version.title;
						draft.draft_version.body = postData.draft_version.body;
						draft.draft_version.description = postData.draft_version.description;
						draft.draft_version.tags = postData.draft_version.tags;
						draft.draft_version.featured_image = postData.draft_version.featured_image;
						draft.draft_version.slug = postData.draft_version.slug;
						draft.author = postData.author;
						draft.published_date = postData.published_date;
						draft.status = postData.status;
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
                setIsClient(true);
                }, []);

	useEffect(() => {
            console.log('initial load')
        if (typeof params.post_id === 'string' && params.post_id !== 'new') {
            const savedState = loadStateFromSessionStorage(params.post_id);
            if (savedState){
                    setPostState(currentData => produce(currentData, draft => {
                                draft.post_id = savedState.post_id;
                                draft.draft_version.title = savedState.draft_version.title;
                                draft.draft_version.body = savedState.draft_version.body;
                                draft.draft_version.description = savedState.draft_version.description;
                                draft.draft_version.tags = savedState.draft_version.tags;
                                draft.draft_version.featured_image = savedState.draft_version.featured_image;
                                draft.draft_version.slug = savedState.draft_version.slug;
                                draft.author = savedState.slug;
                                draft.published_date = savedState.published_date;
                                draft.status = savedState.author;
                                draft.published_version = savedState.published_version;
                               draft.seo_metadata = savedState.seo_metadata;
                                }));
                } else {
                    // Fetch post data or handle as missing post
                    console.log('Loading from server');
			       loadPostData();
                    }
            } else if (params.post_id === 'new'){

                const newPostId = uuidv4();
                setPostState(currentState => produce(currentState, draftState => {
                            draftState.post_id = newPostId;
                            draftState.status = 'draft';
                            }));
                router.replace(`/admin-panel/blog/${newPostId}`, undefined,{ shallow: true }  )
                }
	}, [params.post_id, router]);

	// useEffect for initializing Session Storage and handling the unmount and recall of the post data

    useEffect(() => {
        if (postState.post_id){
            saveStateToSessionStorage(postState.post_id, postState);
            }
        }, [postState])

	// Handle changes en save to states
	const handleChange = (value: string, stateToChange: DraftVersionKeys) => {
		setEditMade(true);
		switch (stateToChange) {
            case 'title':
			case 'description':
			case 'body':
				setPostState(currentData => produce(currentData, draft => { draft.draft_version[stateToChange] = value}));
				break;
			case 'author':
				setPostState(currentData => produce(currentData, draft => { draft.author = value}));
				break;
			case 'tags':
				if (value.includes(',')) {
					const newTags = value.split(',')
					.map(tag => tag.trim())
					.filter(tag => tag);
					setPostState(currentData => produce(currentData, draft => { draft.draft_version.tags.push(...newTags);
					}));
				}
				break;
			default:
				console.log('No state property was chosen');
				break;
		}
}

////////----------Handle the Saves into the Database -------/////////////

const handleSaveChanges = async () => {
		try {
            // Nos recoge el titulo y nos lo convierte a un slug .
			const postSlug = titleToSlug(postState.draft_version.title);
            // Recogemos la información que se ha guardado en el State.
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
            console.log('Saving blog was successful', result)
			setEditMade(false);
			setChangesSaved(true);
		} catch (error) {
			console.error('Error during post upload:', error);
			setEditMade(true);
		  }
	}


    const handlePublishPost = async () => {
        const result = await publishBlogPost(postState.post_id);
        console.log('Publishing blog post was successful', result)
        setEditMade(false);
        setChangesSaved(false);
    }

	const updateSelectedSlot = () => {
		const [url, alt] = selectedMedia;
        if (isImageSlotSelected === false){
            insertImageIntoTinyMCE(url, alt);
            setShowMediaGallery(false);
            setEditMade(true);
        } else if (isImageSlotSelected === true) {
            setPostState(currentData => produce(currentData, draft => {
                                draft.draft_version.featured_image = url }));
            setEditMade(true);
            setShowMediaGallery(false);
            setImageSlotSelected(false);
        }

        //Now here is must take the selected media and use the selectedItemId to link it to the imageSlot (if the imageslot was selected)
	}

	const handleMediaSelected = (mediaSelected: [string, string]) => {
			setSelectedMedia(mediaSelected);
		}

    const openMediaUploader = () => {
        //open Media Uploader
        setShowMediaGallery(true);
        }

    const handleEditorInit = (editor) => {
        setEditorRef(editor);
        setEditorInitialized(true);
        }

    const insertImageIntoTinyMCE = (url, alt) => {
        if (editorRef) {
            editorRef.insertContent(`<img src=\"${url}\" alt=\"${alt}\" />`);
            }
        }

    console.log('This is the params post: ',params.post_id);

	const handleItemSelection= (selectedId: string) => {
		showEditOptions(true);
        setImageSlotSelected(true);
		setSelectedItemId(selectedId);
	}

	const toggleMediaGalleryVisibility = () => {
		setShowMediaGallery(true);
		showEditOptions(false);
	}

    const handleEditLink = () => {
        /// Don't do anything
    }
/////////////---------The Actual Component----------/////////////

	return (
	<div id={styles.blogContainer} >
        {isClient ? (
        <>
        <h1>Welcome to the <em>blog editor</em>!</h1>

        { showMediaGallery  &&  <MediaViewer sendSelect={handleMediaSelected} modalWindow={true} setImageSlot={updateSelectedSlot}/> }
		{ isEditOptionsVisible && <SelectWindow select={toggleMediaGalleryVisibility} editLink={handleEditLink} hasLink={false}/>}

                    {/* Featured Image */}
				<ImageSlot
					src={postState.draft_version.featured_image}
					alt=""
					link=""
					setSelectedId={handleItemSelection}
					connection_id={postState.post_id}
					type="illustration"
					/>

{/*Title*/}
	<input
		type="text"
		value={postState.draft_version.title}
		onChange={e => handleChange(e.target.value, 'title')}
		placeholder="Post Title"
		/>

{/*Description*/}
	<input
		type="text"
		value={postState.draft_version.description}
		onChange={e => handleChange(e.target.value, 'description')}
		placeholder="Post Description"
		/>

{/*--------/////////------Tags--------/////////---------
	<input
		type="text"
		value={postState.draft_version.tags}
		onChange={e => handleChange(e.target.value, 'tags')}
		placeholder="Post tags"
	/>
*/}

{/*Editor*/}
		<Editor
			apiKey={editorKey}
			init={{
					plugins: 'tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
					toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat | mediaSelector',
					tinycomments_mode: 'embedded',
					tinycomments_author: 'Author name',
                    setup: function(editor) {
                        editor.ui.registry.addButton('mediaSelector', {
                            icon: 'gallery',
                            tooltip: 'Insert image from Media Library',
                            onAction: function(_) {
                                openMediaUploader();
                                }
                            })
                        },
					mergetags_list: [
						{ value: 'First.Name', title: 'First Name' },
						{ value: 'Email', title: 'Email' },
				    ],
			     }}
			initialValue={editorInitialized ? undefined : postState.draft_version.body}
            onInit={(evt, editor) => {
				// Set the flag to true once the editor is initialized
                handleEditorInit(editor);

				if (!editorInitialized) {
				setEditorInitialized(true);
				}
		}}
		onEditorChange={(content) =>handleChange(content, 'body')}
		/>
		<label>Author: </label>
		<select	id="author" onChange={e => handleChange(e.target.value, 'author')}>
			<option value="lucia-castro">Lucía Castro</option>
		</select>

		{editMade && <button onClick={handleSaveChanges}>Save Changes</button>}
		{changesSaved && <button onClick={handlePublishPost}>Publish</button>}

</>

    ) : (
                    <div>Loading editor...</div>
        )}

    </div>

)};

export default BlogEditor;
