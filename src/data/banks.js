/**
 * Supported Indian Banks & Digital Payment Service Providers for Incident Mode
 */

export const POPULAR_BANKS = [
  { id: 'sbi', name: 'State Bank of India (SBI)', helpline: '1800 1234 / 1800 2100' },
  { id: 'hdfc', name: 'HDFC Bank', helpline: '1800 1600 / 1800 2600' },
  { id: 'icici', name: 'ICICI Bank', helpline: '1800 1080' },
  { id: 'axis', name: 'Axis Bank', helpline: '1860 419 5555' },
  { id: 'pnb', name: 'Punjab National Bank', helpline: '1800 180 2222' },
  { id: 'paytm', name: 'Paytm Payments Bank', helpline: '0120 4456 456' },
  { id: 'gpay_phonepe', name: 'PhonePe / Google Pay (UPI)', helpline: 'In-app Help Center' },
  { id: 'other', name: 'Other (Specify Custom Bank or Digital Wallet)', helpline: 'Bank Customer Care' },
];

export const TIMELINE_OPTIONS = [
  { id: 'golden_hour', label: 'Within the last 2 hours (Critical Golden Hour)', badge: 'CRITICAL', color: '#ef4444' },
  { id: 'today', label: 'Today (2–12 hours ago)', badge: 'HIGH', color: '#f97316' },
  { id: 'yesterday', label: '1–2 days ago', badge: 'MODERATE', color: '#f59e0b' },
  { id: 'older', label: 'More than 2 days ago', badge: 'LATE', color: '#64748b' },
];
