// This endpoint is now deprecated. Use FastAPI backend for real restaurant data.
export async function GET() {
  return new Response("This endpoint is deprecated. Use FastAPI backend for real data.", { status: 410 })
}
