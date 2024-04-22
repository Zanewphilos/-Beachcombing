const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Utility function for handling fetch requests without authentication
async function fetchPublic(url: string, options: RequestInit = {}): Promise<any> {
  const response = await fetch(`${apiUrl}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Server responded with an error: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Expected JSON response was not returned by the server.');
  }

  try {
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error('Failed to parse server response as JSON.');
  }
}

// Service object for instructions
export const instructionService = {
  getInstructions: async (): Promise<any> => {
    return fetchPublic('/Instruction/Instruction', {
      method: 'GET',
    });
  },
};