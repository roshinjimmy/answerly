import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { answerScripts, referenceAnswers } = await request.json();

    if (!answerScripts || !referenceAnswers) {
      return NextResponse.json(
        { error: "Missing required data: answerScripts or referenceAnswers" },
        { status: 400 }
      );
    }

    // Mock evaluation logic
    interface AnswerScript {
      script: string;
    }

    interface ReferenceAnswer {
      reference: string;
    }

    interface EvaluationResult {
      script: string;
      score: number;
      reference: string;
    }

    const results: EvaluationResult[] = answerScripts.map((script: string, index: number) => ({
      script,
      score: Math.floor(Math.random() * 100), // Random score for demonstration
      reference: referenceAnswers[index % referenceAnswers.length] as string,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error in evaluation API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
