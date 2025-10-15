// Add to your existing JavaScript code

// Share Document Functions
async function shareDocument(doc) {
    // Generate PDF first
    const pdfBlob = await generatePDF(doc);
    
    // Show share modal
    const shareModal = document.getElementById('shareModal');
    shareModal.style.display = 'block';
    
    // Setup share options
    setupShareOptions(doc, pdfBlob);
}

function setupShareOptions(doc, pdfBlob) {
    // Email sharing
    document.getElementById('shareEmail').addEventListener('click', async () => {
        const emailContent = await generateEmailContent(doc);
        const subject = `${doc.type} #${doc.number} from ${companyInfo.name}`;
        
        // Create form data for email API
        const formData = new FormData();
        formData.append('to', doc.clientEmail);
        formData.append('subject', subject);
        formData.append('html', emailContent);
        formData.append('attachment', pdfBlob, `${doc.type}_${doc.number}.pdf`);
        
        try {
            const response = await sendEmail(formData);
            showNotification('Email sent successfully!', 'success');
        } catch (error) {
            showNotification('Failed to send email. Please try again.', 'error');
        }
    });
    
    // WhatsApp sharing
    document.getElementById('shareWhatsapp').addEventListener('click', () => {
        const message = generateWhatsAppMessage(doc);
        const whatsappUrl = `https://wa.me/${doc.clientMobile}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
    
    // SMS sharing
    document.getElementById('shareSMS').addEventListener('click', () => {
        const message = generateSMSMessage(doc);
        const smsUrl = `sms:${doc.clientMobile}?body=${encodeURIComponent(message)}`;
        window.location.href = smsUrl;
    });
}

function generateWhatsAppMessage(doc) {
    return `Hi ${doc.clientName},

Your ${doc.type.toLowerCase()} #${doc.number} for $${doc.total.toFixed(2)} is ready.

Payment Details:
Bank: ${bankInfo.name}
BSB: ${bankInfo.bsb}
Account: ${bankInfo.account}
Account Name: ${bankInfo.accountName}

Thank you for your business!
${companyInfo.name}`;
}

function generateSMSMessage(doc) {
    return `Your ${doc.type.toLowerCase()} #${doc.number} for $${doc.total.toFixed(2)} is ready. Please check your email for details. Thank you! - ${companyInfo.name}`;
}

async function generateEmailContent(doc) {
    const template = await fetch('/emailTemplate.html').then(res => res.text());
    
    // Replace placeholders with actual content
    return template.replace('<!-- Content will be dynamically inserted here -->', `
        <div class="header">
            <div class="logo">
                <img src="${companyInfo.logoUrl}" alt="${companyInfo.name} Logo">
            </div>
            <div class="document-type">
                <h1>${doc.type.toUpperCase()} #${doc.number}</h1>
                <p>Date: ${formatDate(doc.date)}</p>
            </div>
        </div>
        
        <div class="company-info">
            <h2>${companyInfo.name}</h2>
            <p>${companyInfo.address}</p>
            <p>ABN: ${companyInfo.abn}</p>
            <p>Phone: ${companyInfo.phone}</p>
            <p>Email: ${companyInfo.email}</p>
        </div>
        
        <div class="client-info">
            <h3>Bill To:</h3>
            <p>${doc.clientName}</p>
            <p>${doc.clientEmail}</p>
            <p>${doc.clientMobile}</p>
            <p>${doc.jobAddress}</p>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Hours</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${doc.items.map(item => `
                    <tr>
                        <td>${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>${item.hours}</td>
                        <td>$${item.rate.toFixed(2)}</td>
                        <td>$${item.amount.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="totals">
            <div class="totals-row">
                <span>Subtotal:</span>
                <span>$${doc.subtotal.toFixed(2)}</span>
            </div>
            <div class="totals-row">
                <span>GST (10%):</span>
                <span>$${doc.gst.toFixed(2)}</span>
            </div>
            <div class="totals-row">
                <strong>Total:</strong>
                <strong>$${doc.total.toFixed(2)}</strong>
            </div>
        </div>
        
        <div class="payment-details">
            <h3>Payment Details</h3>
            <p>Bank: ${bankInfo.name}</p>
            <p>BSB: ${bankInfo.bsb}</p>
            <p>Account: ${bankInfo.account}</p>
            <p>Account Name: ${bankInfo.accountName}</p>
        </div>
    `);
}

// Function to send email
async function sendEmail(formData) {
    // Replace with your email sending API endpoint
    const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Failed to send email');
    }
    
    return response.json();
}