import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: Number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("database is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}` || "",
      {}
    );
    connection.isConnected = db.connections[0].readyState;
    console.log("database connected successfully");
  } catch (error) {
    console.error("DB_CONNECT_ERROR:: database connection failed: ", error);
    process.exit(1);
  }
}

export default dbConnect;
