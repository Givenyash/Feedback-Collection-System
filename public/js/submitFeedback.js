document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            // Get the button to change its text during submission
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Collect data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // --- 1. Form Validation ---
            if (data.message.trim().length < 10) {
                alert("Please provide a more detailed comment (at least 10 characters).");
                return;
            }

            // --- 2. UI Feedback (Loading State) ---
            submitBtn.innerText = "Submitting...";
            submitBtn.disabled = true;

            try {
                const response = await fetch('/submit-feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // 1. Show the Green Success Message
                    const successMsg = document.querySelector('.bg-green-200');
                    successMsg.classList.remove('hidden');
                    
                    // 2. Show the Browser Alert Message
                    alert("Thank you! Your feedback has been submitted successfully.");

                    // 3. Clear the form fields
                    this.reset();

                    // 4. Automatically hide the success message after 3 seconds
                    setTimeout(() => {
                        successMsg.classList.add('hidden');
                    }, 3000); 

                } else {
                    throw new Error('Server error');
                }
                
            } catch (error) {
                console.error("Submission Error:", error);
                document.querySelector('.bg-red-200').classList.remove('hidden');
                document.querySelector('.bg-green-200').classList.add('hidden');
            } finally {
                // --- 3. Reset Button State ---
                submitBtn.innerText = "Submit";
                submitBtn.disabled = false;
            }
        });
    }
});