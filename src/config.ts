import 'dotenv/config';

const config = {
    host: process.env.HOST || 'http://localhost:4000',
    mongo_uri: process.env.MONGO_URI || '',
    port: process.env.PORT || '4000'
}

export default config;