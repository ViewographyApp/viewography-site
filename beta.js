// Set to the verified form endpoint that delivers requests to support@viewography.app.
const betaSubmissionEndpoint = 'https://formsubmit.co/ajax/support@viewography.app';
const betaPanel = document.querySelector('#beta-panel');
const betaForm = document.querySelector('#beta-form');
const betaStatus = document.querySelector('#beta-status');
document.querySelector('#beta-open').addEventListener('click', () => betaPanel.showModal());
document.querySelector('.beta-close').addEventListener('click', () => betaPanel.close());
betaPanel.addEventListener('click', (event) => { if (event.target === betaPanel) { const rect = betaPanel.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) betaPanel.close(); } });
betaForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!betaForm.reportValidity()) return;
  if (!betaSubmissionEndpoint) {
    betaStatus.textContent = 'Online requests are not available yet. Please email support@viewography.app to request Apple iOS beta access.';
    return;
  }
  const submit = betaForm.querySelector('[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Sending…';
  betaStatus.textContent = '';
  const data = new FormData(betaForm);
  data.set('name', data.get('name').trim());
  data.set('email', data.get('email').trim());
  data.set('Apple ID email address', data.get('email'));
  data.set('_subject', 'Viewography Apple iOS beta access request');
  data.set('_url', 'https://viewography.app/');
  data.set('_template', 'table');
  try {
    const response = await fetch(betaSubmissionEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    const result = await response.json();
    if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('Submission failed');
    betaStatus.textContent = 'Request sent. Thank you for helping make Viewography better! We’ll contact you by email about Apple iOS beta access.';
    betaForm.reset();
  } catch {
    betaStatus.textContent = 'Your request could not be sent. Please try again or email support@viewography.app. Your details are still in the form.';
  } finally {
    submit.disabled = false;
    submit.textContent = 'Submit request';
  }
});
