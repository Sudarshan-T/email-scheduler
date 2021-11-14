import { connect } from 'mongoose';

export class Database {
    async databaseConnection() {
        try {
            await connect(process.env.MONGODB_URL)
            console.log('Connected to database')
        } catch (err) {
            throw new Error(err)
        }
    }
}