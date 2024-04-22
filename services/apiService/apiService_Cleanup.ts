import {  CleanupRecordSubmission } from '../../types/CleanupTypes';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithAuth(url: string, options: RequestInit): Promise<any> {
    
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };

    const combinedOptions = {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    };

    const response = await fetch(`${apiUrl}${url}`, combinedOptions);

    if (!response.ok) {
        throw new Error('Server responded with an error: ' + response.statusText);
    }

    try {
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw new Error('An error occurred, and the server did not return a JSON response.');
    }
}


export const apiService_cleanup = {

    submitCleanupRecord: async (data: CleanupRecordSubmission): Promise<any> => {
        const formData = new FormData();

        formData.append('trashCounts', JSON.stringify(data.trashCounts));
        for (let i = 0; i < data.images.length; i++) {
            formData.append('images', data.images[i]);
        }

        return fetchWithAuth('/CleanupRecords', {
            method: 'POST',
            body: formData,
            
        });
    },
};