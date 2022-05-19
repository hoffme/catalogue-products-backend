import 'dotenv/config';

const config = {
    images_path: process.env.IMAGES_PATH || 'images',
    mongo_uri: process.env.MONGO_URI || '',
    port: process.env.PORT || '4000'
}

export default config;