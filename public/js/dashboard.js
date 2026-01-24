document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('feedbackTable');
    
    try {
        const response = await fetch('/api/all-feedbacks');
        const feedbacks = await response.json();

        if (feedbacks.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No feedback found.</td></tr>';
            return;
        }

        let counts = { total: feedbacks.length, product: 0, customer: 0, review: 0, others: 0 };
        tableBody.innerHTML = ''; // Clear "No feedback found"

        feedbacks.forEach((item, index) => {
            const row = `
                <tr class="hover:bg-blue-50 border-b border-blue-500">
                    <td class="border-r border-blue-500 px-4 py-2">${index + 1}</td>
                    <td class="border-r border-blue-500 px-4 py-2">${item.fullName || 'N/A'}</td>
                    <td class="border-r border-blue-500 px-4 py-2">${item.email || 'N/A'}</td>
                    <td class="border-r border-blue-500 px-4 py-2">${item.category || 'N/A'}</td>
                    <td class="border-r border-blue-500 px-4 py-2">${item.message || 'N/A'}</td>
                    <td class="px-4 py-2">${new Date(item.date).toLocaleDateString()}</td>
                </tr>`;
            tableBody.innerHTML += row;

            // Logic to update counts
            const cat = (item.category || '').toLowerCase();
            if (cat.includes('product')) counts.product++;
            else if (cat.includes('customer')) counts.customer++;
            else if (cat.includes('review')) counts.review++;
            else counts.others++;
        });

        // Update the UI boxes
        document.getElementById('count-total').innerText = counts.total;
        document.getElementById('count-product').innerText = counts.product;
        document.getElementById('count-customer').innerText = counts.customer;
        document.getElementById('count-review').innerText = counts.review;
        document.getElementById('count-others').innerText = counts.others;

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
});