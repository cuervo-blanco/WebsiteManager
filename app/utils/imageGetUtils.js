
export const getImageList = async (page, limit) => {

	try {
		const response = await fetch(`http://localhost:3002/image-list?page=${page}&limit=${limit}`);
				if (!response.ok) {
			throw new Error(`Image fetch failed: ${response.status}`);
		}
		return response;
	} catch (error) {
		console.error('Error getting the image list:', error);
		throw error;
	}
}

export const deleteImage = async (imgUrl) => {
	try {
		const response = await fetch(`http://localhost:3002/delete-image`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ imgUrl: imgUrl })
	}
);
		if (!response.ok) {
		throw new Error(`Image delete failed: ${response.status}`);
		}

	} catch (error){
	console.error('Error deleting the image', error);
		throw error;
	}

}
