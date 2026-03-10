// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// type IncomingResponse = {
//   answer: string[];
//   questionId: number;
//   questionnaireId: number;
// };

// type CookieUser = {
//   id: number;
//   username: string;
//   isAdmin: boolean;
// };

// function getUserFromCookie(req: NextRequest): CookieUser | null {
//   const cookie = req.cookies.get("user")?.value;
//   if (!cookie) return null;

//   try {
//     return JSON.parse(cookie) as CookieUser;
//   } catch {
//     try {
//       return JSON.parse(decodeURIComponent(cookie)) as CookieUser;
//     } catch {
//       return null;
//     }
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const user = getUserFromCookie(req);

//     if (!user?.id || !Number.isInteger(user.id)) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }

//     const body = await req.json();
//     const responses: IncomingResponse[] = Array.isArray(body?.responses) ? body.responses : [];

//     if (responses.length === 0) {
//         console.log("No responses provided in request body");
//       return NextResponse.json({ error: "No responses provided" }, { status: 400 });
//     }

//     const validResponses = responses.filter(
//       (item) =>
//         Number.isInteger(item.questionId) &&
//         Number.isInteger(item.questionnaireId) &&
//         Array.isArray(item.answer),
//     );

//     if (validResponses.length === 0) {
//       return NextResponse.json({ error: "No valid responses provided" }, { status: 400 });
//     }

//     console.log("Data being sent to Prisma:", validResponses.map(item => ({
//   userId: user.id,
//   questionId: item.questionId,
//   questionnaireId: item.questionnaireId,
//   answer: item.answer 
// })));

//     await prisma.responses.createMany({
//       data: validResponses.map((item) => ({
//         userId: user.id,
//         questionId: item.questionId,
//         questionnaireId: item.questionnaireId,
//         answer: item.answer,
//       })),
//     });

//     return NextResponse.json({ ok: true, count: validResponses.length });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to save responses" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type IncomingResponse = {
  answer: string[];
  questionId: number;
  questionnaireId: number;
};

type CookieUser = {
  id: number;
  username: string;
  isAdmin: boolean;
};

function getUserFromCookie(req: NextRequest): CookieUser | null {
  const cookie = req.cookies.get("user")?.value;
  if (!cookie) return null;

  try {
    return JSON.parse(cookie) as CookieUser;
  } catch {
    try {
      return JSON.parse(decodeURIComponent(cookie)) as CookieUser;
    } catch {
      return null;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromCookie(req);

    if (!user?.id || !Number.isInteger(user.id)) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const responses: IncomingResponse[] = Array.isArray(body?.responses) ? body.responses : [];

    if (responses.length === 0) {
      console.log("No responses provided in request body");
      return NextResponse.json({ error: "No responses provided" }, { status: 400 });
    }

    const validResponses = responses.filter(
      (item) =>
        Number.isInteger(item.questionId) &&
        Number.isInteger(item.questionnaireId) &&
        Array.isArray(item.answer),
    );

    if (validResponses.length === 0) {
      return NextResponse.json({ error: "No valid responses provided" }, { status: 400 });
    }

    console.log("Data being sent to Prisma:", validResponses.map(item => ({
      userId: user.id,
      questionId: item.questionId,
      questionnaireId: item.questionnaireId,
      answer: item.answer 
    })));

    // Execute both the insert and the update as a single transaction
    await prisma.$transaction([
      prisma.responses.createMany({
        data: validResponses.map((item) => ({
          userId: user.id,
          questionId: item.questionId,
          questionnaireId: item.questionnaireId,
          answer: item.answer,
        })),
      }),
      
      prisma.user.update({
        where: { id: user.id },
        data: {
          questionCount: {
            increment: 1, // Atomically increases the field by 1
          },
        },
      }),
    ]);

    return NextResponse.json({ ok: true, count: validResponses.length });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed to save responses" }, { status: 500 });
  }
}
