// lib/apiResponse.ts
// Format response API yang konsisten di semua endpoint
import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

export function notFound(message = "Data tidak ditemukan") {
  return NextResponse.json({ success: false, message }, { status: 404 });
}

export function serverError(error: unknown) {
  console.error("[API Error]", error);
  const message =
    error instanceof Error ? error.message : "Internal server error";
  return NextResponse.json({ success: false, message }, { status: 500 });
}