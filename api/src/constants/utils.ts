export const utils = {
    PASS_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    RUNTIME_REGEX: /^([1-5]+h (([0-5][0-9])|([0-9]))m)|([1-9] season?s)/,
    MONGO_DB_ID_REGEX: /^[0-9a-fA-F]{24}$/,

    MONGO_DB_URL: 'mongodb://localhost:27017/movie_streaming',
};
