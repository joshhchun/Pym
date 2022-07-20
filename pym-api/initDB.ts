
import mongoose from 'mongoose';

var options = {
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

module.exports = () => {
    mongoose
        .connect((process.env.MONGODB_URI as string), options)
        .then(() => {
            console.log('MongoDB Connected!');
        })
        .catch(err => console.log(err.message));
};