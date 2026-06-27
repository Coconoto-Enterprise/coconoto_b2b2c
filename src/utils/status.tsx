import React from 'react';

export const getStatusColor = (status?: string) => {
  if (!status) return 'text-gray-600 bg-gray-100';
  switch (String(status).toLowerCase()) {
    case 'delivered':
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'sent':
    case 'pending':
      return 'text-blue-600 bg-blue-100';
    case 'failed':
    case 'bounced':
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    case 'processing':
      return 'text-yellow-600 bg-yellow-100';
    case 'draft':
      return 'text-gray-700 bg-gray-200';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getStatusIcon = (status?: string) => {
  const s = String(status || '').toLowerCase();
  switch (s) {
    case 'delivered':
    case 'completed':
      return React.createElement('span', { 'aria-hidden': true }, '✓');
    case 'failed':
    case 'bounced':
    case 'cancelled':
      return React.createElement('span', { 'aria-hidden': true }, '✖');
    case 'processing':
      return React.createElement('span', { 'aria-hidden': true }, '⏳');
    case 'draft':
      return React.createElement('span', { 'aria-hidden': true }, '📝');
    case 'pending':
    case 'sent':
      return React.createElement('span', { 'aria-hidden': true }, '📨');
    default:
      return React.createElement('span', { 'aria-hidden': true }, '•');
  }
};

export default getStatusColor;
