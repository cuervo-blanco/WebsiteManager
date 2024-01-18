	import { getImageList } from './imageGetUtils';

	export async function fetchData(page, limit, setImages, setTotalPages, setLoading, isMounted) {
		try {
			const response = await getImageList(page, limit);
			if(!response.ok){
			throw new Error(`HTTP status code: ${response.status}`);
			}
			const data = await response.json();
			console.log('received images: ', data.images);

			if(isMounted){
				setImages(data.images);
				setTotalPages(data.totalPages);	
			}
		} catch (error) {
			console.error('Failed to fetch data:', error);
		}  finally {
			if (isMounted){
				setLoading(false);
			}
		}

	} 

