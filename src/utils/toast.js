import { toast as toastify } from 'react-toastify';
import Swal from 'sweetalert2';

/**
 * Centralized toast notification utility
 * Provides consistent toast notifications across the application
 */

const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const toast = {
  /**
   * Success notification
   * @param {string} message - Message to display
   * @param {object} options - Additional toast options
   */
  success: (message, options = {}) => {
    toastify.success(message, { ...defaultOptions, ...options });
  },

  /**
   * Error notification
   * @param {string} message - Message to display
   * @param {object} options - Additional toast options
   */
  error: (message, options = {}) => {
    toastify.error(message, { ...defaultOptions, autoClose: 5000, ...options });
  },

  /**
   * Info notification
   * @param {string} message - Message to display
   * @param {object} options - Additional toast options
   */
  info: (message, options = {}) => {
    toastify.info(message, { ...defaultOptions, ...options });
  },

  /**
   * Warning notification
   * @param {string} message - Message to display
   * @param {object} options - Additional toast options
   */
  warning: (message, options = {}) => {
    toastify.warning(message, { ...defaultOptions, autoClose: 4000, ...options });
  },

  /**
   * Loading notification
   * @param {string} message - Message to display
   * @returns {number} Toast ID for updating/dismissing
   */
  loading: (message) => {
    return toastify.loading(message, { 
      position: "top-right",
      closeButton: false,
    });
  },

  /**
   * Update existing toast
   * @param {number} toastId - ID of toast to update
   * @param {object} options - Update options
   */
  update: (toastId, options) => {
    toastify.update(toastId, options);
  },

  /**
   * Dismiss a specific toast or all toasts
   * @param {number} toastId - Optional ID of toast to dismiss. If not provided, dismisses all.
   */
  dismiss: (toastId) => {
    if (toastId) {
      toastify.dismiss(toastId);
    } else {
      toastify.dismiss();
    }
  },

  /**
   * Confirmation dialog (uses SweetAlert2 for blocking modals)
   * @param {string} title - Dialog title
   * @param {string} text - Dialog message
   * @param {object} options - Additional SweetAlert2 options
   * @returns {Promise<boolean>} True if confirmed, false if cancelled
   */
  confirm: async (title = 'Are you sure?', text = '', options = {}) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      ...options
    });
    return result.isConfirmed;
  },

  /**
   * Promise-based toast for async operations
   * Shows loading state, then success or error based on promise result
   * @param {Promise} promise - Promise to track
   * @param {object} messages - {pending, success, error} messages
   * @returns {Promise} The original promise
   */
  promise: (promise, messages) => {
    return toastify.promise(
      promise,
      {
        pending: messages.pending || 'Processing...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong!'
      },
      { position: "top-right" }
    );
  }
};

export default toast;
