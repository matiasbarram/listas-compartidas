const AppConfig = {
    app: {
        name: process.env.APP_NAME || 'NodeJS Express',
        server: process.env.APP_SERVER || 'localhost',
        isDev: ['development', 'dev', 'local'].includes(process.env.NODE_ENV || 'development'),
        port: process.env.PORT || 8000,
        apiVersion: process.env.API_VERSION || 'v1',
        secret: process.env.SECRET || 'secret',
    },
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,

    }
};

export default Object.freeze(AppConfig);