const domain = 'http://localhost:3002';
console.log('Domain value now:', domain);

export const uploadFile = async (formData) => {

	try {
	const response = await fetch(`${domain}/upload`, {
		method: 'POST',
		body: formData,
	});

	if (!response.ok) {
		throw new Error(`Upload failed: ${response.status}`);
	}
		return await response.text();
	}   catch (error) {
		console.error('Error uploading the file:', error);
		throw error;
	}
}


export const updateContent = async (changes) => {

		try {
	 const response1 = await fetch('api/save-changes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({changes: changes})
        });

        if (!response1.ok) {
            throw new Error(`Saving to first endpoint failed: ${response1.status}`);
        }

        // Optionally, handle the response
        const result1 = await response1.json();

        // Second endpoint
		const response2 = await fetch('http://localhost:3002/update-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
			body: JSON.stringify({content: changes})
        });

        if (!response2.ok) {
            throw new Error(`Saving to second endpoint failed: ${response2.status}`);
        }

        // Optionally, handle the response
        const result2 = await response2.json();

        // Return results or handle them as needed
        return { result1, result2 };

    } catch (error) {
		console.error('Error updating the illustrations', error);
		throw error;
	}

}

export const saveBlogPost = async (blogPost) => {
    console.log('Post to save:', blogPost)
	try {
		const response = await fetch('http://localhost:3002/save-blog-post', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ post: blogPost })
		});

		if (!response.ok){
			throw new Error(`Error saving blog post to website server: ${response.status}`);
		}

		const result = await response.json();

		return result;

	} catch (error) {
		console.error('Error saving the blog post', error);
		throw error;
	}
}

export const deletePost = async (post_id) => {
    try {
        const response = await fetch('http://localhost:3002/delete-blog-post', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({  postId: post_id})
        });

        if (!response.ok) {
           throw new Error(`Error deleting blog post to website's server: ${response.status}`);
        }

        const result = await response.json();

        return result;

    } catch (error) {
        console.error('Error deleting the blog post', error);
        throw error;
    }

}

export const publishBlogPost = async (post_id) => {
		try {
		const response = await fetch('http://localhost:3002/publish-post', {
			method: 'POST',
			headers: {
				'Content-Type':  'application/json',
			},
			body: JSON.stringify({ postId: post_id})
		});

			if (!response.ok){
				throw new Error(`Error publishing blog post: ${response.status}`);
			}

			const result = await response.json();

			return result;
	} catch (error) {
		console.error('Error publishing blog post', error);
		throw error;
		}
}

export const getPost = async (post_id) => {
    try {
        const response = await fetch(`http://localhost:3002/get-post/${post_id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
            },
        });
            if (!response.ok){
                throw new Error(`Error getting blog post: ${response.status}`);
            }

            const result = await response.json();

            return result;
    } catch (error) {
        console.error('Error getting blog post', error);
        throw error;
    }
}

export const getPostList = async () => {
    try {
        const response = await fetch('http://localhost:3002/get-post-list', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
            },
        });

        if (!response.ok){
            throw new Error(`Error getting list of posts: ${response.status}`);
        }

        const result = await response.json();
        console.log(response.json);
        return result;

    } catch (error) {

    }
}
