/**
 * Admin Sanitizer
 * Normalizes inputs for admin management endpoints.
 */
export const sanitizeAdminTeamUpdate = (data: any) => {
    const sanitized: any = {};
    if (data.name !== undefined) sanitized.name = data.name ? data.name.trim() : '';
    if (data.leader_id !== undefined) sanitized.leader_id = data.leader_id ? data.leader_id.trim() : '';
    return sanitized;
};

export const sanitizeAdminMemberUpdate = (data: any) => {
    const sanitized: any = {};
    if (data.email !== undefined) sanitized.email = data.email ? data.email.trim().toLowerCase() : '';
    if (data.role !== undefined) sanitized.role = data.role ? data.role.trim().toLowerCase() : '';
    if (data.name !== undefined) sanitized.name = data.name ? data.name.trim() : '';
    if (data.student_id !== undefined) sanitized.student_id = data.student_id ? data.student_id.trim().toUpperCase() : '';
    if (data.batch_session !== undefined) sanitized.batch_session = data.batch_session ? data.batch_session.trim() : '';
    if (data.phone_number !== undefined) sanitized.phone_number = data.phone_number ? data.phone_number.trim() : '';
    return sanitized;
};

export const sanitizeTeamLimits = (data: any) => {
    return {
        min_team_size: data.min_team_size !== undefined ? Number(data.min_team_size) : undefined,
        max_team_size: data.max_team_size !== undefined ? Number(data.max_team_size) : undefined
    };
};

export const sanitizeToggleRegistration = (data: any) => {
    return {
        is_registration_open: Boolean(data.is_registration_open)
    };
};
