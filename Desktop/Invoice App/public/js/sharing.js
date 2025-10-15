// Sharing functionality
class ShareManager {
    constructor() {
        this.initializeListeners();
    }

    initializeListeners() {
        document.addEventListener('click', (e) => {
            const shareButton = e.target.closest('[data-share-action]');
            if (shareButton) {
                const action = shareButton.dataset.shareAction;
                const docId = shareButton.closest('[data-doc-id]')?.dataset.docId;
                const docType = shareButton.closest('[data-doc-type]')?.dataset.docType;

                if (docId && docType) {
                    this.handleShare(action, docId, docType);
                }
            }
        });
    }

    async handleShare(action, docId, docType) {
        try {
            const doc = await this.getDocument(docId, docType);
            if (!doc) return;

            switch(action) {
                case 'whatsapp':
                    await this.shareViaWhatsApp(doc, docType);
                    break;
                case 'sms':
                    await this.shareViaSMS(doc, docType);
                    break;
            }
        } catch (error) {
            console.error('Share error:', error);
            this.showNotification('Error sharing document. Please try again.', 'error');
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

    async shareViaWhatsApp(doc, type) {
        const message = this.buildShareMessage(doc, type);
        const phoneNumber = doc.clientPhone ? doc.clientPhone.replace(/\D/g, '') : '';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        this.showNotification('Opening WhatsApp...', 'info');
    }

    async shareViaSMS(doc, type) {
        const message = this.buildShareMessage(doc, type);
        const phoneNumber = doc.clientPhone || '';
        const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        this.showNotification('Opening SMS...', 'info');
    }

    buildShareMessage(doc, type) {
        const companyName = 'SMART SQUAD M BUILD PTY LTD';
        const message = [
            `${type.toUpperCase()} - ${companyName}`,
            `Number: ${doc.number || 'N/A'}`,
            `Client: ${doc.clientName || 'N/A'}`,
            `Amount: $${(doc.totalAmount || 0).toFixed(2)}`,
            doc.dueDate ? `Due Date: ${new Date(doc.dueDate).toLocaleDateString()}` : '',
        ].filter(Boolean).join('\n');

        return message;
    }

    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(message);
        }
    }
}

// Initialize sharing functionality
window.shareManager = new ShareManager();