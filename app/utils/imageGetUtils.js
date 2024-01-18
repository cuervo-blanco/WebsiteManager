
export const getImageList = async (page, limit) => {

	try {
	console.log(`http://localhost:3002/image-list?page=${page}&limit=${limit}`);
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
