document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const createFolderBtn = document.getElementById('createFolderBtn');
    const folderModal = document.getElementById('folderModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeButton = document.querySelector('.close-button');
    const cancelBtn = document.getElementById('cancelBtn');
    const folderForm = document.getElementById('folderForm');
    const foldersContainer = document.getElementById('folders-container');
    const modalTitle = document.getElementById('modalTitle');
    
    // Delete modal elements
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    let currentFolderId = null;
    
    // Load folders when page loads
    fetchAndDisplayFolders();

    // Event Listeners
    createFolderBtn.addEventListener('click', openCreateModal);
    closeButton.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    folderForm.addEventListener('submit', handleFormSubmit);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    
    // Close modal if clicking outside the content
    window.addEventListener('click', function(event) {
        if (event.target === folderModal) {
            closeModal();
        }
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    });

    // Functions
   function fetchAndDisplayFolders() {
    fetch('getFolders.php')
        .then(response => response.json())
        .then(data => {
            // Check if data is an array (normal folders data)
            if (Array.isArray(data)) {
                renderFolders(data);
            } 
            // Check if data is an error response
            else if (data.success === false) {
                console.error('Error from server:', data.message);
                // Still render with empty array to avoid errors
                renderFolders([]);
            } 
            // Handle any other unexpected format
            else {
                console.error('Unexpected data format:', data);
                renderFolders([]);
            }
        })
        .catch(error => {
            console.error('Error fetching folders:', error);
            // Render with empty array on error
            renderFolders([]);
        });
}

    function renderFolders(folders) {
        foldersContainer.innerHTML = '';
        
        if (folders.length === 0) {
            // If no folders, you could add a message or leave it empty
            return;
        }
        
        folders.forEach(folder => {
            const folderElement = createFolderElement(folder);
            foldersContainer.appendChild(folderElement);
        });
    }

    function createFolderElement(folder) {
        const folderCard = document.createElement('div');
        folderCard.className = 'folder-card';
        folderCard.innerHTML = `
            <img src="${escapeHTML(folder.image_url)}" alt="${escapeHTML(folder.name)}" class="folder-image" onerror="this.src='https://community.spotify.com/t5/image/serverpage/image-id/55829i90534E0A2E7F3129/image-size/large?v=v2&px=999'">
            <h3 class="folder-name">${escapeHTML(folder.name)}</h3>
            <p class="folder-description">${escapeHTML(folder.description)}</p>
            <div class="folder-actions">
                <button class="edit-button" data-id="${folder.id}">Edit</button>
                <button class="delete-button" data-id="${folder.id}">Delete</button>
            </div>
        `;
        
        // Add event listeners to the buttons
        const editBtn = folderCard.querySelector('.edit-button');
        const deleteBtn = folderCard.querySelector('.delete-button');
        
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openEditModal(folder);
        });
        
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openDeleteModal(folder.id);
        });
        
        return folderCard;
    }

    function openCreateModal() {
        modalTitle.textContent = 'Create New Folder';
        document.getElementById('folderId').value = '';
        folderForm.reset();
        
        // Display the modal
        folderModal.style.display = 'flex';
    }

    function openEditModal(folder) {
        modalTitle.textContent = 'Edit Folder';
        
        // Fill the form with folder data
        document.getElementById('folderId').value = folder.id;
        document.getElementById('folderName').value = folder.name;
        document.getElementById('imageUrl').value = folder.image_url;
        document.getElementById('description').value = folder.description;
        
        currentFolderId = folder.id;
        
        // Display the modal
        folderModal.style.display = 'flex';
    }

    function openDeleteModal(folderId) {
        currentFolderId = folderId;
        deleteModal.style.display = 'flex';
        
        // Set up the confirm delete button
        confirmDeleteBtn.onclick = function() {
            deleteFolder(currentFolderId);
        };
    }

    function closeModal() {
        folderModal.style.display = 'none';
        folderForm.reset();
        currentFolderId = null;
    }

    function closeDeleteModal() {
        deleteModal.style.display = 'none';
        currentFolderId = null;
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const folderId = document.getElementById('folderId').value;
        const folderName = document.getElementById('folderName').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const description = document.getElementById('description').value;
        
        const formData = new FormData();
        formData.append('name', folderName);
        formData.append('image_url', imageUrl);
        formData.append('description', description);
        
        // Determine if we're creating or updating
        let url, method;
        if (folderId) {
            // Update existing folder
            url = 'updateFolder.php';
            method = 'POST';
            formData.append('id', folderId);
        } else {
            // Create new folder
            url = 'createFolder.php';
            method = 'POST';
        }
        
        fetch(url, {
            method: method,
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeModal();
                fetchAndDisplayFolders();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    }

    function deleteFolder(folderId) {
        const formData = new FormData();
        formData.append('id', folderId);
        
        fetch('deleteFolder.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeDeleteModal();
                fetchAndDisplayFolders();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    }
    
    // Helper function to escape HTML content
    function escapeHTML(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
