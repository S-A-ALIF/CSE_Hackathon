/**
 * Auth Sanitizer
 * Normalizes user input to prevent data inconsistency.
 */
export const sanitizeAuthInput = (data: any) => {
    return {
        email: data.email ? data.email.toLowerCase().trim() : '',
        password: data.password ? data.password.trim() : '',
        role: data.role ? data.role.toLowerCase().trim() : 'student'
    };
};