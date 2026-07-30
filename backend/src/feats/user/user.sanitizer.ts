/**
 * User Profile Sanitizer
 * Normalizes inputs and ensures only valid fields are mapped.
 */
export const sanitizeUserProfile = (data: any) => {
    const sanitized: any = {};

    if (data.name !== undefined) sanitized.name = data.name ? data.name.trim() : '';
    if (data.student_id !== undefined) sanitized.student_id = data.student_id ? data.student_id.trim().toUpperCase() : '';
    if (data.batch_session !== undefined) sanitized.batch_session = data.batch_session ? data.batch_session.trim() : '';
    if (data.phone_number !== undefined) sanitized.phone_number = data.phone_number ? data.phone_number.trim() : '';

    return sanitized;
};
