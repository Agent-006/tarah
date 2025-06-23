// app/api/debug-session/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function GET() {
  const session = await getServerSession(authOptions);
  return Response.json({
    sessionExists: !!session,
    userRole: session?.user?.role
  });
}