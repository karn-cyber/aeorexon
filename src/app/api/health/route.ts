import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });

    const dbName = process.env.MONGODB_DB ?? "aorexon";
    const admin = client.db().admin();
    const { databases } = await admin.listDatabases();

    return NextResponse.json({
      ok: true,
      message: "Connected to MongoDB",
      db: dbName,
      databases: databases.map((d) => d.name),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to connect to MongoDB",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
