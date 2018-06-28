const ENV = {
    PORT: process.env.PORT || 443,
    USER_NAME: process.env.USER_NAME || "blue",
    USER_PASSWORD: process.env.USER_PASSWORD || "forest",
    USER_ADMIN: process.env.USER_ADMIN || true,
    DB_NAME: process.env.DB_NAME || "JsonWebTokenTest",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: process.env.DB_PORT || 27017,
    NODE_ENV: process.env.NODE_ENV || null,
    TOKEN_SECRET: process.env.TOKEN_SECRET || "s]^#'ta\"éà_{p*ok^}sdfp^*d*,ç:m+81+ç:m8:914p:p_1ç8_1:pç1515",
    MORGAN: process.env.MORGAN || "common"
};

export default ENV;