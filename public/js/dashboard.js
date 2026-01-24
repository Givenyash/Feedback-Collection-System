let allFeedbacks = []; // Store data globally for filtering

document.addEventListener("DOMContentLoaded", async () => {
  await fetchFeedbacks();

  // --- Search Logic ---
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allFeedbacks.filter(
      (f) =>
        f.fullName.toLowerCase().includes(term) ||
        f.email.toLowerCase().includes(term),
    );
    renderTable(filtered);
  });

  // --- Export to CSV Logic ---
  document.getElementById("exportBtn").addEventListener("click", () => {
    let csvContent =
      "data:text/csv;charset=utf-8,Sl.NO,Name,Email,Category,Comment,Date\n";
    allFeedbacks.forEach((f, i) => {
      csvContent += `${i + 1},${f.fullName},${f.email},${f.category},${f.message},${f.date}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "feedbacks.csv");
    document.body.appendChild(link);
    link.click();
  });
});

async function fetchFeedbacks() {
  try {
    const response = await fetch("/api/all-feedbacks");
    allFeedbacks = await response.json();
    renderTable(allFeedbacks);
    updateAnalysis(allFeedbacks);
  } catch (err) {
    console.error(err);
  }
}

function renderTable(data) {
    const tableBody = document.getElementById('feedbackTable');
    tableBody.innerHTML = data.map((item, index) => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-3 border text-center">${index + 1}</td>
            <td class="p-3 border">${item.fullName}</td>
            <td class="p-3 border">${item.email}</td>
            <td class="p-3 border text-center">${item.category}</td>
            <td class="p-3 border">${item.message}</td>
            <td class="p-3 border text-center">${new Date(item.date).toLocaleDateString()}</td>
            <td class="p-3 border text-center">
                <button onclick="deleteFeedback('${item._id}')" class="text-red-500 hover:text-red-700">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

}
// Delete feedback function
async function deleteFeedback(id) {
  if (confirm("Are you sure you want to delete this?")) {
    await fetch(`/api/delete-feedback/${id}`, { method: "DELETE" });
    fetchFeedbacks(); // Refresh data
  }
}

function updateAnalysis(feedbacks) {
  const counts = {
    total: feedbacks.length,
    product: 0,
    customer: 0,
    review: 0,
    others: 0,
  };
  feedbacks.forEach((f) => {
    const cat = f.category.toLowerCase();
    if (cat.includes("product")) counts.product++;
    else if (cat.includes("customer")) counts.customer++;
    else if (cat.includes("review")) counts.review++;
    else counts.others++;
  });
  document.getElementById("count-total").innerText = counts.total;
  document.getElementById("count-product").innerText = counts.product;
  document.getElementById("count-customer").innerText = counts.customer;
  document.getElementById("count-review").innerText = counts.review;
  document.getElementById("count-others").innerText = counts.others;
}

function setupCheckboxListeners() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const deleteBtn = document.getElementById('deleteSelectedBtn');

    // Toggle all checkboxes
    selectAll.addEventListener('change', () => {
        checkboxes.forEach(cb => cb.checked = selectAll.checked);
        toggleDeleteButton();
    });

    checkboxes.forEach(cb => {
        cb.addEventListener('change', toggleDeleteButton);
    });

    function toggleDeleteButton() {
        const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
        if (checkedCount > 0) {
            deleteBtn.classList.remove('hidden');
        } else {
            deleteBtn.classList.add('hidden');
        }
    }
}
