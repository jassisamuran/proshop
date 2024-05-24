import mongoose from "mongoose";
const connectDb = async () => {
  const str = "mongodb+srv://mani:147258369@cluster0.nw0xkz4.mongodb.net/";
  try {
    mongoose.set("strictQuery", false);
    const con = await mongoose.connect(str, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`Mongo Connected:${con.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};
export default connectDb;
