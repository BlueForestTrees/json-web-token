const ENV = {
    PORT: process.env.PORT || 8080,
    DB_NAME: process.env.DB_NAME || "JsonWebTokenTest",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: process.env.DB_PORT || 27017,
    NODE_ENV: process.env.NODE_ENV || null
};



export default ENV;