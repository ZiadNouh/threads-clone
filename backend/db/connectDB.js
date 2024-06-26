import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    };

    await mongoose.connect(process.env.MONGO_URI, dbOptions).then(() => {
      console.log("mongoDB is connected");
    });
  } catch (error) {
    console.error(`Error :${error.message}`);
  }
};
