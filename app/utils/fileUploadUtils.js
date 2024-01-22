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


export const updateIllustrations = async (changes) => {

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
		const response2 = await fetch('http://localhost:3002/update-illustrations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
			body: JSON.stringify({illustrations: changes})
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
