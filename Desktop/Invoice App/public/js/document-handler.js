// Document Generation and Sharing Functions

async function generateDocumentHTML(doc, mode = 'email') {
    try {
        // Get the template
        const templateResponse = await fetch('/templates/email-template.html');
        const templateHTML = await templateResponse.text();
        
        // Create a temporary container
        const container = document.createElement('div');
        container.innerHTML = templateHTML;
        
        // Get the document container
        const docContainer = container.querySelector('.document-container') || container;
        
        // Generate the content
        const content = `
            <div class="header">
                <div class="logo-section">
                    <img src="${doc.companyInfo.logoUrl}" alt="${doc.companyInfo.name} Logo" class="company-logo">
                </div>
                <div class="company-info">
                    <h2>${doc.companyInfo.name}</h2>
                    <p>${doc.companyInfo.address}</p>
                    <p>ABN: ${doc.companyInfo.abn}</p>
                    <p>Phone: ${doc.companyInfo.phone}</p>
                    <p>Email: ${doc.companyInfo.email}</p>
                </div>
            </div>

            <div class="document-title">
                ${doc.type.toUpperCase()} #${doc.number}
            </div>

            <div class="document-meta">
                <div class="client-details">
                    <h3 class="section-title">Client Information</h3>
                    <div class="detail-row">
                        <span class="label">Name:</span>
                        <span>${doc.billTo.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Company:</span>
                        <span>${doc.billTo.company || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Email:</span>
                        <span>${doc.billTo.email || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Phone:</span>
                        <span>${doc.billTo.mobile || 'N/A'}</span>
                    </div>
                </div>

                <div class="job-details">
                    <h3 class="section-title">Job Details</h3>
                    <div class="detail-row">
                        <span class="label">Job Address:</span>
                        <span>${doc.jobDetails.address || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Job Number:</span>
                        <span>${doc.jobDetails.number || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Work Order:</span>
                        <span>${doc.jobDetails.workOrder || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Date:</span>
                        <span>${formatDate(doc.date)}</span>
                    </div>
                </div>
            </div>

            <table class="items-table">
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
                            <td>$${parseFloat(item.rate).toFixed(2)}</td>
                            <td>$${parseFloat(item.amount).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="amounts-section">
                <div class="amount-row">
                    <span>Subtotal:</span>
                    <span>$${doc.subtotal.toFixed(2)}</span>
                </div>
                <div class="amount-row">
                    <span>GST (10%):</span>
                    <span>$${doc.gst.toFixed(2)}</span>
                </div>
                <div class="amount-row total">
                    <span>Total:</span>
                    <span>$${doc.total.toFixed(2)}</span>
                </div>
            </div>

            <div class="payment-details">
                <h3 class="section-title">Payment Details</h3>
                <div class="detail-row">
                    <span class="label">Bank:</span>
                    <span>${doc.bankDetails.bankName}</span>
                </div>
                <div class="detail-row">
                    <span class="label">BSB:</span>
                    <span>${doc.bankDetails.bsb}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Account:</span>
                    <span>${doc.bankDetails.account}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Account Name:</span>
                    <span>${doc.bankDetails.accountName}</span>
                </div>
            </div>

            <div class="terms-conditions">
                <h3 class="section-title">Terms & Conditions</h3>
                <p>1. Payment is due within 14 days of invoice date.</p>
                <p>2. All prices are in AUD and include GST where applicable.</p>
                <p>3. Late payments may incur additional charges.</p>
            </div>

            <div class="footer">
                <p>Thank you for your business!</p>
                <p>${doc.companyInfo.name} | ABN: ${doc.companyInfo.abn}</p>
                <p>${doc.companyInfo.address} | Phone: ${doc.companyInfo.phone}</p>
            </div>
        `;
        
        docContainer.innerHTML = content;
        
        // For email, wrap in additional context
        if (mode === 'email') {
            const emailWrapper = `
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                    <p>Dear ${doc.billTo.name},</p>
                    
                    <p>Please find attached your ${doc.type.toLowerCase()} #${doc.number}.</p>
                    
                    <p>Total Amount: $${doc.total.toFixed(2)}</p>
                    
                    <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                        <strong>Payment Details:</strong><br>
                        Bank: ${doc.bankDetails.bankName}<br>
                        BSB: ${doc.bankDetails.bsb}<br>
                        Account: ${doc.bankDetails.account}<br>
                        Account Name: ${doc.bankDetails.accountName}
                    </p>
                    
                    <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
                    
                    <p>Best regards,<br>${doc.companyInfo.name}</p>
                    
                    <hr>
                    
                    <div style="margin-top: 20px; font-size: 0.9em; color: #666;">
                        ${doc.companyInfo.name}<br>
                        ABN: ${doc.companyInfo.abn}<br>
                        Phone: ${doc.companyInfo.phone}<br>
                        Email: ${doc.companyInfo.email}
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    ${container.innerHTML}
                </div>
            `;
            return emailWrapper;
        }
        
        return container.innerHTML;
    } catch (error) {
        console.error('Error generating document HTML:', error);
        throw error;
    }
}

// Function to handle both email and print
function showShareModal(doc) {
    const modal = document.getElementById('shareModal');
    modal.style.display = 'flex';
    
    // Setup share options
    setupShareHandlers(doc);
}

function setupShareHandlers(doc) {
    const modal = document.getElementById('shareModal');
    
    // Email handler
    document.getElementById('shareEmail').onclick = async () => {
        try {
            modal.style.display = 'none';
            const htmlContent = await generateDocumentHTML(doc, 'email');
            
            if (!doc.billTo.email) {
                throw new Error('Client email address is not available');
            }
            
            const emailParams = {
                to_email: doc.billTo.email,
                to_name: doc.billTo.name,
                from_name: doc.companyInfo.name,
                subject: `${doc.type} #${doc.number} from ${doc.companyInfo.name}`,
                message_html: htmlContent,
                client_name: doc.billTo.name,
                amount: doc.total.toFixed(2),
                invoice_number: doc.number,
                company_name: doc.companyInfo.name,
                bank_name: doc.bankDetails.bankName,
                bsb: doc.bankDetails.bsb,
                account: doc.bankDetails.account,
                account_name: doc.bankDetails.accountName
            };
            
            await emailjs.send(
                'service_YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'template_YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                emailParams,
                'YOUR_USER_ID' // Replace with your EmailJS user ID
            );
            
            showNotification('Email sent successfully!', 'success');
        } catch (error) {
            console.error('Email error:', error);
            showNotification(error.message || 'Error sending email. Please try again.', 'error');
        }
    };
    
    // WhatsApp handler
    document.getElementById('shareWhatsapp').onclick = () => {
        try {
            modal.style.display = 'none';
            
            if (!doc.billTo.mobile) {
                throw new Error('Client mobile number is not available');
            }
            
            const message = `Hi ${doc.billTo.name},\n\n`
                + `Your ${doc.type.toLowerCase()} #${doc.number} for $${doc.total.toFixed(2)} is ready.\n\n`
                + `Payment Details:\n`
                + `Bank: ${doc.bankDetails.bankName}\n`
                + `BSB: ${doc.bankDetails.bsb}\n`
                + `Account: ${doc.bankDetails.account}\n`
                + `Account Name: ${doc.bankDetails.accountName}\n\n`
                + `Thank you for your business!\n`
                + `${doc.companyInfo.name}`;
                
            const phone = doc.billTo.mobile.replace(/[^0-9]/g, '');
            const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        } catch (error) {
            console.error('WhatsApp error:', error);
            showNotification(error.message || 'Error sharing via WhatsApp. Please try again.', 'error');
        }
    };
    
    // SMS handler
    document.getElementById('shareSMS').onclick = () => {
        try {
            modal.style.display = 'none';
            
            if (!doc.billTo.mobile) {
                throw new Error('Client mobile number is not available');
            }
            
            const message = `${doc.type} #${doc.number} - $${doc.total.toFixed(2)} from ${doc.companyInfo.name}. `
                + `Payment: ${doc.bankDetails.bankName} BSB:${doc.bankDetails.bsb} ACC:${doc.bankDetails.account}`;
            
            const phone = doc.billTo.mobile.replace(/[^0-9]/g, '');
            const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;
            window.location.href = smsUrl;
        } catch (error) {
            console.error('SMS error:', error);
            showNotification(error.message || 'Error sharing via SMS. Please try again.', 'error');
        }
    };
}

async function handleDocument(doc, action = 'print') {
    try {
        const htmlContent = await generateDocumentHTML(doc, action);
        
        if (action === 'email') {
            // Send email
            const emailParams = {
                to_email: doc.billTo.email,
                to_name: doc.billTo.name,
                from_name: doc.companyInfo.name,
                subject: `${doc.type} #${doc.number} from ${doc.companyInfo.name}`,
                message_html: htmlContent
            };
            
            await emailjs.send(
                'service_YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'template_YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                emailParams,
                'YOUR_USER_ID' // Replace with your EmailJS user ID
            );
            showNotification('Email sent successfully!', 'success');
        } else {
            // Print
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${doc.type} #${doc.number}</title>
                    <meta charset="utf-8">
                    <style>
                        @media print {
                            @page {
                                size: A4;
                                margin: 20mm;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${htmlContent}
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() { window.close(); }, 500);
                        };
                    </script>
                </body>
                </html>
            `);
        }
    } catch (error) {
        console.error(`Error ${action === 'email' ? 'sending email' : 'printing'}:`, error);
        showNotification(`Error ${action === 'email' ? 'sending email' : 'printing'}. Please try again.`, 'error');
    }
}