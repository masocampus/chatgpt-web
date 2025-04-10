import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

// IMPORTANT: OpenAI API 키는 환경 변수에서 자동으로 로드됩니다.
// 별도의 new OpenAI() 초기화가 필요하지 않습니다.
// process.env.OPENAI_API_KEY 또는 OPENAI_API_KEY 환경 변수를 설정해야 합니다.

// Edge Runtime 사용 설정 (Vercel 배포에 유리)
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse('Invalid request body: messages must be an array.', { status: 400 });
    }

    // AI 모델 호출 및 스트리밍 응답 생성
    const result = await streamText({
      // 사용할 AI 모델 지정 (예: 'gpt-4-turbo', 'gpt-3.5-turbo')
      // openai() 함수는 등록된 OpenAI 모델 인스턴스를 반환합니다.
      model: openai('gpt-3.5-turbo'),
      // 전달할 메시지 배열
      messages,
    });

    // 생성된 스트리밍 응답을 클라이언트로 반환
    return result.toDataStreamResponse();

  } catch (error) {
    console.error('[API Chat Error]', error);

    // 에러 처리 (간단한 예시)
    if (error instanceof Error) {
      // APIError와 같은 특정 에러 타입을 확인하여 더 상세한 처리가 가능합니다.
      // 예: OpenAI API 관련 에러인지 확인
      return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse('An unknown error occurred.', { status: 500 });
  }
} 