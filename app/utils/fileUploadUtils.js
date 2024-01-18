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
