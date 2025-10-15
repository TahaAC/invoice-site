// Document handling functionality
class DocumentHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupListeners();
    }

    setupListeners() {
        document.addEventListener('click', (e) => {
            const actionButton = e.target.closest('[data-action]');
            if (actionButton) {
                const action = actionButton.dataset.action;
                const docId = actionButton.dataset.id;
                const docType = actionButton.dataset.type || 'invoice';

                switch(action) {
                    case 'download':
                        this.handleDownload(docId, docType);
                        break;
                    case 'print':
                        this.handlePrint(docId, docType);
                        break;
                }
            }
        });
    }

    async handleDownload(docId, type) {
        try {
            const button = document.querySelector(`[data-action="download"][data-id="${docId}"]`);
            if (button) {
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
            }

            const doc = await this.getDocument(docId, type);
            if (!doc) return;

            // Generate PDF logic would go here
            console.log('Downloading document:', docId);

            this.showNotification('Document downloaded successfully', 'success');
        } catch (err) {
            console.error('Error downloading document:', err);
            this.showNotification('Failed to download document', 'error');
        } finally {
            const button = document.querySelector(`[data-action="download"][data-id="${docId}"]`);
            if (button) {
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-download"></i> Download';
            }
        }
    }

    async handlePrint(docId, type) {
        try {
            const doc = await this.getDocument(docId, type);
            if (!doc) return;

            // Print logic would go here
            window.print();
        } catch (err) {
            console.error('Error printing document:', err);
            this.showNotification('Failed to print document', 'error');
        }
    }

    async getDocument(id, type) {
        try {
            const doc = await firebase.firestore()
                .collection(type + 's')
                .doc(id)
                .get();

            if (!doc.exists) {
                this.showNotification(`${type} not found`, 'error');
                return null;
            }

            return { ...doc.data(), id: doc.id };
        } catch (error) {
            console.error('Error getting document:', error);
            this.showNotification('Error retrieving document', 'error');
            return null;
        }
    }

    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(message);
        }
    }
}

// Initialize document handler
window.documentHandler = new DocumentHandler();