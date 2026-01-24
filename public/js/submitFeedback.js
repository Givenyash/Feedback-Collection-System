document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                category: formData.get('category'),
                message: formData.get('message')
            };

            try {
                const response = await fetch('/submit-feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert("Feedback saved! Refresh Compass to see it.");
                    this.reset();
                } else {
                    alert("Server error: Data not saved.");
                }
            } catch (error) {
                console.error("Submission Error:", error);
            }
        });
    } else {
        console.error("Error: Could not find element with ID 'feedbackForm'");
    }
});