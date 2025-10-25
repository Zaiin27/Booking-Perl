import toast from "react-hot-toast";

class LimitedToastManager {
  constructor(maxToasts = 3) {
    this.maxToasts = maxToasts;
    this.toastQueue = [];
  }

  // Add a new toast and manage the queue
  addToast(message, type = 'default', options = {}) {
    // If we already have max toasts, remove the oldest one
    if (this.toastQueue.length >= this.maxToasts) {
      const oldestToast = this.toastQueue.shift();
      toast.dismiss(oldestToast.id);
    }

    // Create new toast based on type
    let toastId;
    switch (type) {
      case 'success':
        toastId = toast.success(message, {
          ...options,
          id: `toast-${Date.now()}-${Math.random()}`,
        });
        break;
      case 'error':
        toastId = toast.error(message, {
          ...options,
          id: `toast-${Date.now()}-${Math.random()}`,
        });
        break;
      case 'loading':
        toastId = toast.loading(message, {
          ...options,
          id: `toast-${Date.now()}-${Math.random()}`,
        });
        break;
      default:
        toastId = toast(message, {
          ...options,
          id: `toast-${Date.now()}-${Math.random()}`,
        });
    }

    // Add to queue
    this.toastQueue.push({
      id: toastId,
      message,
      type,
      timestamp: Date.now()
    });

    return toastId;
  }

  // Success toast
  success(message, options = {}) {
    return this.addToast(message, 'success', options);
  }

  // Error toast
  error(message, options = {}) {
    return this.addToast(message, 'error', options);
  }

  // Loading toast
  loading(message, options = {}) {
    return this.addToast(message, 'loading', options);
  }

  // Custom toast
  custom(message, options = {}) {
    return this.addToast(message, 'default', options);
  }

  // Dismiss specific toast
  dismiss(toastId) {
    toast.dismiss(toastId);
    this.toastQueue = this.toastQueue.filter(t => t.id !== toastId);
  }

  // Dismiss all toasts
  dismissAll() {
    toast.dismiss();
    this.toastQueue = [];
  }

  // Get current toast count
  getToastCount() {
    return this.toastQueue.length;
  }

  // Get toast queue (for debugging)
  getToastQueue() {
    return this.toastQueue;
  }
}

// Create singleton instance
const limitedToastManager = new LimitedToastManager(3);

export default limitedToastManager;
