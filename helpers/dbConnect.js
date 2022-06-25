import mongoose from 'mongoose';

const connect = async () => {
    const {
        MONGO_SCHEME: scheme,
        MONGO_USER: user,
        MONGO_PASS: password,
        MONGO_HOST: host,
    } = process.env;
    const dbName = process.env[ 'MONGO_DB_' + process.env.NODE_ENV.toUpperCase() ]

    const dataBaseUrl = `${scheme}${user}:${password}@${host}/${dbName}`;

    await mongoose.connect(dataBaseUrl)

}

export default await connect();