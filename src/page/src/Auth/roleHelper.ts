export const ROLE = {
    ADMIN: 1,
    OPERATOR: 2,
    USER: 3,
};

export const haveAccess = (role: number[], ...needRole: number[]) => {
    console.log(role);
    return needRole.some((r) => role.includes(r));
};
