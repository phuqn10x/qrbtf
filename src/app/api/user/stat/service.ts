import { connectToDatabase } from "@/lib/server/mongodb";
import { ObjectId } from "mongodb";

const USER_QRCODE_STAT_COLLECTION = "user_qrcode_stat";
const QRCODE_LOG_COLLECTION = "user_qrcode_log";

interface UserQrcodeStat {
  _id: ObjectId;
  generation_count: number;
  download_count: number;
}

interface QrcodeLog {
  user_id?: string;
  type: string;
  params: any;
}

export async function getUserQrcodeStat(user_id: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection<UserQrcodeStat>(USER_QRCODE_STAT_COLLECTION);

  const result = await collection.findOne({
    _id: new ObjectId(user_id),
  });
  return result;
}

export async function incGenerationCount(user_id: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection<UserQrcodeStat>(USER_QRCODE_STAT_COLLECTION);

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(user_id) },
    { $inc: { generation_count: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  return result?.generation_count;
}

export async function incDownloadCount(user_id: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection<UserQrcodeStat>(USER_QRCODE_STAT_COLLECTION);

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(user_id) },
    { $inc: { download_count: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  return result?.download_count;
}

export async function logQrcode(data: QrcodeLog) {
  const { db } = await connectToDatabase();
  const collection = db.collection<QrcodeLog>(QRCODE_LOG_COLLECTION);

  const result = await collection.insertOne(data);
  return result;
}