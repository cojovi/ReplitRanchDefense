// Global error handler to catch and isolate the .value error
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('reading \'value\'')) {
    console.error('VALUE ERROR CAUGHT:', {
      message: event.error.message,
      stack: event.error.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
    
    // Prevent the error from propagating to the overlay
    event.preventDefault();
    return false;
  }
});

// Also catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('reading \'value\'')) {
    console.error('VALUE PROMISE REJECTION:', event.reason);
    event.preventDefault();
  }
});