import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Jwt from "@/lib/services/jwt.js";
import Address from "@/lib/models/Address.js";
import dbConnect from "@/lib/db";
import { OrderError, validateAddress } from "@/lib/services/orderService";

export async function GET() {
  try {
    await dbConnect();
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const decoded = Jwt.verifyToken(token);
    const addresses = await Address.find({ userId: decoded.id });
    
    return NextResponse.json({ success: true, addresses });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const decoded = Jwt.verifyToken(token);
    const fields = validateAddress(await req.json());
    const address = await Address.create({ userId: decoded.id, ...fields });

    return NextResponse.json({ success: true, message: "Address saved successfully", address });
  } catch (err: any) {
    if (err instanceof OrderError) {
      return NextResponse.json({ success: false, message: err.message }, { status: err.status });
    }
    console.error("[address:create]", err);
    return NextResponse.json({ success: false, message: "Could not save address" }, { status: 500 });
  }
}
