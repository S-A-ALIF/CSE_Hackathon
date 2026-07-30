/**
 * Team Sanitizer
 * Normalizes inputs for team operations (creation, invite, joining, leadership transfer).
 */
export const sanitizeTeamInput = (data: any) => {
    const sanitized: any = {};

    if (data.name !== undefined) sanitized.name = data.name ? data.name.trim() : '';
    if (data.emailToInvite !== undefined) sanitized.emailToInvite = data.emailToInvite ? data.emailToInvite.trim().toLowerCase() : '';
    if (data.pinCode !== undefined) sanitized.pinCode = data.pinCode ? data.pinCode.trim().toUpperCase() : '';
    if (data.teamCode !== undefined) sanitized.teamCode = data.teamCode ? data.teamCode.trim().toUpperCase() : '';
    if (data.newLeaderId !== undefined) sanitized.newLeaderId = data.newLeaderId ? data.newLeaderId.trim() : '';
    if (data.is_full !== undefined) sanitized.is_full = Boolean(data.is_full);

    return sanitized;
};
