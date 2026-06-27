export async function sendOtp({ mobile, otp }) {
  console.log(`Development OTP for ${mobile}: ${otp}`);
  return { delivered: true, provider: 'development-console' };
}

export async function sendSosAlerts({ contacts = [], location, message, timestamp }) {
  const alerts = contacts.map((contact) => ({
    to: contact.mobile,
    contact: contact.name,
    message,
    location,
    timestamp,
    status: 'queued'
  }));

  console.log('Development SOS alerts:', alerts);
  return alerts;
}
