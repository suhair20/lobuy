import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Jwt from "@/lib/services/jwt.js";
import Address from "@/lib/models/Address.js";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const decoded = Jwt.verifyToken(token) as unknown as { id: string };
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

    const decoded = Jwt.verifyToken(token) as unknown as { id: string };
    const body = await req.json();

    const address = await Address.create({
      userId: decoded.id,
      fullName: body.fullName,
      phone: body.phone,
      district: body.district || body.city,
      city: body.city,
      pincode: body.pincode,
      addressLine: body.addressLine,
      landmark: body.landmark || "",
      state: body.state || "Kerala",
    });

    return NextResponse.json({
      success: true,
      message: "Address saved successfully",
      address,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
