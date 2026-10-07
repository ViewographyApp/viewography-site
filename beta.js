// Set to the verified form endpoint that delivers requests to support@viewography.app.
const betaSubmissionEndpoint = 'https://formsubmit.co/ajax/support@viewography.app';
const betaPanel = document.querySelector('#beta-panel');
const betaForm = document.querySelector('#beta-form');
const betaStatus = document.querySelector('#beta-status');
const betaCopy = {
  iPhone: { label: 'Apple ID email address', help: 'Enter the email address you use for your Apple ID so we can invite you to the Apple iOS beta through TestFlight.', submit: 'Submit request', subject: 'Viewography Apple iOS beta access request', sent: 'Request sent. Thank you for helping make Viewography better! We’ll contact you by email about Apple iOS beta access.' },
  Android: { label: 'Email address', help: 'We’ll only use this to tell you when the Android beta is ready.', submit: 'Join the Android waitlist', subject: 'Viewography Android waitlist', sent: 'You’re on the Android waitlist. Thank you! We’ll email you when an Android beta is ready.' }
};
const betaDevice = () => betaForm.querySelector('input[name="device"]:checked')?.value || 'iPhone';
function applyBetaDevice() {
  const copy = betaCopy[betaDevice()];
  document.querySelector('#beta-email-label').textContent = copy.label;
  document.querySelector('#beta-email-help').textContent = copy.help;
  document.querySelector('#android-note').hidden = betaDevice() !== 'Android';
  betaForm.querySelector('[type="submit"]').textContent = copy.submit;
}
betaForm.querySelectorAll('input[name="device"]').forEach((input) => input.addEventListener('change', applyBetaDevice));
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
  const device = betaDevice();
  const copy = betaCopy[device];
  data.set(device === 'iPhone' ? 'Apple ID email address' : 'Email address', data.get('email'));
  data.set('_subject', copy.subject);
  data.set('_url', location.href);
  data.set('_template', 'table');
  try {
    const response = await fetch(betaSubmissionEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    const result = await response.json();
    if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('Submission failed');
    betaStatus.textContent = copy.sent;
    betaForm.reset();
    applyBetaDevice();
  } catch {
    betaStatus.textContent = 'Your request could not be sent. Please try again or email support@viewography.app. Your details are still in the form.';
  } finally {
    submit.disabled = false;
    submit.textContent = betaCopy[betaDevice()].submit;
  }
});
