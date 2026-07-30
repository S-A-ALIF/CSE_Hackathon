/**
 * Notification Sanitizer
 * Normalizes notification parameter inputs.
 */
export const sanitizeNotificationId = (id: any) => {
    return id ? String(id).trim() : '';
};
