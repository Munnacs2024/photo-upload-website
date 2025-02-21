const CLIENT_ID = 'abc'; // Replace with your Client ID
const API_KEY = 'xxxx';     // Replace with your API Key
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const REDIRECT_URI = 'https://munnacs2024.github.io/photo-upload-website/'; // Your GitHub Pages URL

// Initialize Google API client
function initializeGapi() {
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
            redirectUri: REDIRECT_URI // Set the redirect URI for OAuth flow
        }).then(() => {
            console.log('Google API initialized.');
        });
    });
}

// Authenticate user and upload file
async function uploadFile(file) {
    const metadata = {
        name: file.name,
        mimeType: file.type,
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
            method: 'POST',
            headers: new Headers({
                Authorization: `Bearer ${gapi.auth.getToken().access_token}`,
            }),
            body: form,
        }
    );

    if (response.ok) {
        const data = await response.json();
        console.log('Uploaded file:', data);
        document.getElementById('status').textContent = 'Upload successful!';
    } else {
        console.error('Upload failed:', response.statusText);
        document.getElementById('status').textContent = 'Upload failed.';
    }
}

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        await gapi.auth2.getAuthInstance().signIn();
        uploadFile(file);
    } else {
        document.getElementById('status').textContent = 'No file selected.';
    }
});

// Load the GAPI library and initialize
initializeGapi();

