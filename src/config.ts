import 'dotenv/config';

const config = {
    mongo_uri: process.env.MONGO_URI || '',
    port: process.env.PORT || '4000'
}

export default config;