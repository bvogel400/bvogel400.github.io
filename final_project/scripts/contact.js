const FORM_KEY = 'portfolioContactSubmissions';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readSubmissions() {
  const raw = localStorage.getItem(FORM_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function saveSubmissions(items) {
  localStorage.setItem(FORM_KEY, JSON.stringify(items));
}

function renderRecentSubmissions() {
  const container = document.querySelector('[data-recent-submissions]');
  if (!container) return;

  const items = readSubmissions().slice(-3).reverse();
  container.innerHTML = items.length
    ? items
      .map((item) => `<li class="submission-item">${item.name} (${item.topic}) on ${item.date}</li>`)
      .join('')
    : '<li class="submission-item">No messages submitted yet.</li>';
}

function clearErrors(form) {
  form.querySelectorAll('[data-error-for]').forEach((errorNode) => {
    errorNode.textContent = '';
  });
}

function setError(form, fieldName, message) {
  const node = form.querySelector(`[data-error-for="${fieldName}"]`);
  if (node) {
    node.textContent = message;
  }
}

function validateForm(fields, form) {
  let isValid = true;

  if (fields.name.trim().length < 2) {
    setError(form, 'name', 'Name must be at least 2 characters.');
    isValid = false;
  }

  if (!EMAIL_PATTERN.test(fields.email)) {
    setError(form, 'email', 'Enter a valid email address.');
    isValid = false;
  }

  if (!fields.topic) {
    setError(form, 'topic', 'Please select a topic.');
    isValid = false;
  }

  if (fields.message.trim().length < 15) {
    setError(form, 'message', 'Message must be at least 15 characters.');
    isValid = false;
  }

  return isValid;
}

function setupContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const status = document.querySelector('[data-form-status]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors(form);
    if (status) status.textContent = '';

    const fields = {
      name: form.name.value,
      email: form.email.value,
      topic: form.topic.value,
      message: form.message.value
    };

    if (!validateForm(fields, form)) return;

    const items = readSubmissions();
    items.push({
      id: Date.now(),
      ...fields,
      date: new Date().toLocaleDateString()
    });
    saveSubmissions(items);

    form.reset();
    if (status) status.textContent = 'Message submitted successfully!';
    renderRecentSubmissions();
  });
}

setupContactForm();
renderRecentSubmissions();
