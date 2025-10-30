import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8080";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/test`, { cache: "no-store" });
    if (!res.ok) {
      let body: unknown = null;
      try {
        body = await res.json();
      } catch {
        // ignore non-JSON upstream responses
      }
      return NextResponse.json(
        { message: "Upstream error", status: res.status, body },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Request failed";
    return NextResponse.json({ message }, { status: 502 });
  }
}
