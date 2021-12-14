export const constants = {
    CURR_YEAR: new Date().getFullYear(),

    PASS_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    RUNTIME_REGEX: /^([1-5]+h (([0-5][0-9])|([0-9]))m)|([1-9] season?s)/,
};
