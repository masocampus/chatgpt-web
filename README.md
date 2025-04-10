# 요구사항 정의서

## 프로젝트 목표

ChatGPT와 유사한 채팅 AI Application을 구현합니다. 사용자와 AI 간의 실시간 대화형 인터페이스를 제공하는 것을 목표로 합니다.

## 사용하는 기술 스펙

- UI라이브러리
1. TailwindCSS : https://tailwindcss.com/docs
2. shadcn/ui : https://ui.shadcn.com/docs

- AI SDK
1. Vercel SDK : https://sdk.vercel.ai/docs


## 구현 단계 상세

### Step 1. 프로젝트 초기 설정 및 라이브러리 세팅

1.  **Next.js 프로젝트 생성**: `create-next-app`을 사용하여 TypeScript 기반의 Next.js 프로젝트를 초기화합니다. (`--typescript`, `--tailwind`, `--eslint`, `--app`)
2.  **Tailwind CSS 설정**: `tailwind.config.js` 및 `globals.css` 설정을 완료합니다.
3.  **Shadcn/UI 설정**: `npx shadcn-ui@latest init` 명령어를 사용하여 Shadcn/UI를 프로젝트에 통합하고, 필요한 `components.json` 설정을 구성합니다.
4.  **필수 라이브러리 설치**:
    *   Vercel AI SDK: `npm install ai`
    *   Zod: `npm install zod`
    *   `next-safe-action`: `npm install next-safe-action`
    *   `nuqs`: `npm install nuqs` (URL 상태 관리가 필요한 경우)
    *   기타 필요한 유틸리티 (e.g., `class-variance-authority`, `clsx`, `lucide-react`) - Shadcn 설정 시 일부 자동 설치될 수 있음.
5.  **ESLint/Prettier 설정**: 프로젝트 코딩 규칙(`masocampus-cursor-web-prj-rules2.mdc`)에 맞춰 ESLint 및 Prettier 설정을 구성하고 필요한 플러그인을 설치합니다.
6.  **프로젝트 구조 설정**: `src` 디렉토리를 사용하고, `components/ui`, `components/chat`, `lib/utils`, `app`, `types` 등의 기본 폴더 구조를 설정합니다.

### Step 2. 채팅 API Route Handler 구현 (Vercel AI SDK 활용)

1.  **API 라우트 생성**: Next.js App Router 내에 API Route Handler를 생성합니다 (`app/api/chat/route.ts`).
2.  **Vercel AI SDK 통합**:
    *   선택한 AI 모델 (e.g., OpenAI, Anthropic)에 대한 Vercel AI SDK 설정을 구현합니다.
    *   환경 변수 (`process.env`)를 사용하여 API 키를 안전하게 관리합니다 (e.g., `OPENAI_API_KEY`). `.env.local` 파일을 사용하고 `.gitignore`에 추가합니다.
    *   `POST` 요청 핸들러 내에서 사용자 메시지를 받아 AI 모델에 전달합니다.
3.  **스트리밍 응답 처리**:
    *   Vercel AI SDK의 `StreamingTextResponse` 또는 이와 유사한 기능을 사용하여 AI 모델의 응답을 클라이언트로 스트리밍합니다.
    *   AI SDK가 제공하는 stream/callback 핸들러를 사용하여 스트리밍 중 이벤트(시작, 토큰 수신, 종료 등)를 처리할 수 있도록 구현합니다.
4.  **입력 유효성 검사 (선택 사항)**: API 라우트 핸들러 레벨에서 Zod를 사용하여 기본적인 요청 본문 유효성 검사를 추가할 수 있습니다. (더 엄격한 유효성 검사는 Server Action 사용 시 `next-safe-action`에서 처리하는 것이 일반적입니다.)
5.  **오류 처리**: API 호출 중 발생할 수 있는 오류 (e.g., API 키 오류, 네트워크 문제, 모델 오류)를 처리하고 적절한 HTTP 상태 코드와 오류 메시지를 반환합니다.

### Step 3. 프론트엔드 채팅 인터페이스 및 API 연동

1.  **메인 페이지/컴포넌트 생성**:
    *   채팅 인터페이스를 위한 메인 페이지 (`app/page.tsx`)를 생성합니다.
    *   채팅 UI 로직을 담당할 클라이언트 컴포넌트 (`src/components/chat/ChatInterface.tsx`)를 생성하고 `'use client'` 지시자를 사용합니다.
2.  **Vercel AI SDK `useChat` 훅 사용**:
    *   `ChatInterface.tsx` 컴포넌트 내에서 Vercel AI SDK가 제공하는 `useChat` 훅을 사용합니다.
    *   `useChat` 훅의 `api` 옵션을 `'/api/chat'`으로 설정하여 Step 2에서 구현한 API 라우트와 연결합니다.
    *   훅이 반환하는 상태 (`messages`, `input`, `isLoading`) 와 함수 (`handleInputChange`, `handleSubmit`) 를 사용하여 UI를 구현합니다.
3.  **UI 상태 관리**:
    *   사용자 입력 메시지는 `useChat` 훅의 `input` 상태와 `handleInputChange` 함수로 관리됩니다.
    *   전송 버튼 클릭 시 `handleSubmit` 함수를 호출하여 API 요청을 보냅니다.
    *   `isLoading` 상태를 사용하여 AI 응답 대기 중임을 나타내는 UI (e.g., 로딩 스피너, 버튼 비활성화)를 구현합니다.
    *   `messages` 배열을 사용하여 사용자와 AI의 메시지 목록을 화면에 렌더링합니다.
4.  **오류 처리**: `useChat` 훅이 제공하는 오류 상태나 콜백을 사용하여 API 요청 실패 시 사용자에게 피드백을 제공합니다 (e.g., 에러 메시지 표시).

### Step 4. UI 컴포넌트 구현 (Shadcn/UI 및 Tailwind CSS 활용)

1.  **기본 레이아웃**: `app/layout.tsx` 파일에서 Tailwind CSS를 사용하여 전체 페이지의 기본 구조와 스타일을 정의합니다.
2.  **채팅 관련 컴포넌트**: `src/components/chat/` 디렉토리 내에 필요한 컴포넌트를 구현합니다.
    *   `ChatMessage.tsx`: 개별 채팅 메시지(사용자/AI 구분)를 표시하는 컴포넌트. 메시지 내용, 발신자 정보 등을 props로 받습니다.
    *   `ChatInput.tsx`: 사용자 입력을 받는 컴포넌트. Shadcn의 `Input`과 `Button`을 조합하여 사용합니다. `useChat`의 `input`, `handleInputChange`, `handleSubmit`과 연동됩니다.
    *   `ChatMessages.tsx`: 메시지 목록을 표시하는 컨테이너 컴포넌트. `ChatMessage` 컴포넌트를 반복 렌더링하고 스크롤 기능을 관리할 수 있습니다.
3.  **Shadcn/UI 컴포넌트 활용**:
    *   `@/components/ui/input`: 사용자 메시지 입력 필드.
    *   `@/components/ui/button`: 메시지 전송 버튼.
    *   `@/components/ui/card`: 채팅 인터페이스나 메시지 버블을 감싸는 데 사용될 수 있습니다.
    *   `@/components/ui/scroll-area`: 메시지 목록이 길어질 경우 스크롤 기능을 제공합니다.
    *   `@/components/ui/avatar`: 사용자 또는 AI 아바타 표시에 사용될 수 있습니다.
    *   `@/components/ui/skeleton`: 데이터 로딩 중 스켈레톤 UI 표시에 사용될 수 있습니다.
4.  **스타일링 및 반응형 디자인**:
    *   Tailwind CSS 유틸리티 클래스를 사용하여 모든 컴포넌트의 스타일을 지정합니다. `tailwind.config.js`에 정의된 테마/디자인 토큰을 따릅니다.
    *   모바일 우선 접근 방식을 사용하여 반응형 디자인을 구현합니다.
5.  **접근성 (a11y)**:
    *   시맨틱 HTML 태그를 적절히 사용합니다.
    *   Shadcn/UI (및 Radix UI) 컴포넌트의 내장된 접근성 기능을 활용합니다.
    *   필요한 경우 ARIA 속성을 추가하고 키보드 네비게이션을 테스트합니다.

### Step 5. Vercel 배포

1.  **빌드 확인**: 로컬 환경에서 `npm run build` 명령어를 실행하여 프로젝트가 성공적으로 빌드되는지 확인합니다.
2.  **Vercel 프로젝트 연결**: Vercel 계정에 로그인하고 GitHub (또는 다른 Git 공급자) 저장소를 Vercel 프로젝트에 연결합니다.
3.  **환경 변수 설정**: Vercel 프로젝트 설정 > Environment Variables 메뉴에서 Step 2에서 사용한 AI API 키 등 필요한 환경 변수를 등록합니다. (클라이언트에서 사용하지 않는 키는 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다.)
4.  **배포**: Git 저장소의 main 브랜치(또는 설정된 프로덕션 브랜치)에 코드를 푸시하면 Vercel이 자동으로 빌드 및 배포를 진행합니다.
5.  **테스트**: 배포된 애플리케이션 URL에 접속하여 모든 기능이 정상적으로 작동하는지 테스트합니다. 특히 API 연동 및 채팅 기능, 반응형 디자인을 확인합니다.

## AI Agent
- 테스트 코드 작성
- 코드 리뷰 요청

### AI 코드 리뷰 에이전트 프롬프트 가이드라인

당신은 TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI, Tailwind CSS에 능통한 숙련된 시니어 개발자입니다. 당신의 주요 임무는 제출된 코드를 면밀히 검토하고, 프로젝트의 품질, 유지보수성, 성능, 보안 및 전반적인 표준 준수 여부를 평가하는 것입니다. 단순히 오류를 찾는 것을 넘어, 코드를 개선하고 개발자의 성장을 도울 수 있는 건설적이고 상세하며 실행 가능한 피드백을 제공하는 것을 목표로 합니다.

#### 핵심 리뷰 원칙
1. 프로젝트 규칙 준수: masocampus-cursor-web-prj-rules2.mdc에 명시된 모든 규칙과 지침을 코드 리뷰의 기준으로 삼습니다. 코드 스타일, 구조, 네이밍 컨벤션, 타입스크립트 사용법, UI/스타일링, 성능 최적화, 주요 라이브러리(nuqs, next-safe-action 등) 사용법, 에러 핸들링, 테스트, 문서화 등 모든 측면에서 규칙 준수 여부를 확인합니다.

2. 가독성 및 유지보수성: 코드가 명확하고 이해하기 쉬운지, 장기적으로 유지보수하기 용이한 구조로 작성되었는지 평가합니다. 복잡한 로직은 더 단순하고 직관적인 방식으로 개선할 수 있는지 제안합니다.

3. 성능 고려: Next.js App Router 환경에서의 성능 최적화 원칙(RSC 우선 사용, 'use client' 최소화, Suspense/Dynamic Loading 활용, 이미지 최적화 등)이 잘 지켜졌는지 확인하고, 잠재적인 성능 병목 현상을 지적합니다.

4. 견고성 및 오류 처리: 잠재적인 엣지 케이스, null 또는 undefined 처리 누락, 비동기 로직 오류 등을 식별합니다. 에러 바운더리, Server Action에서의 next-safe-action을 사용한 구조화된 오류 처리 등 적절한 오류 처리 메커니즘이 구현되었는지 확인합니다.

5. 보안: 입력값 검증, 출력값 새니타이징(XSS 방지), 인증/인가 로직, 민감 정보 관리 등 기본적인 웹 보안 취약점을 고려하여 코드를 검토합니다.

6. 타입 안전성: TypeScript의 장점을 최대한 활용하는지, any 타입을 남용하지 않는지, 인터페이스와 타입 별칭을 적절히 사용하는지 확인합니다. next-safe-action 등을 통해 서버-클라이언트 간 타입 안전성이 보장되는지 검토합니다.

7. UI/UX 및 접근성: Shadcn/UI 및 Tailwind CSS 사용 규칙을 준수하는지, 반응형 디자인이 올바르게 구현되었는지, 그리고 시맨틱 HTML, ARIA 속성 등을 통해 웹 접근성(a11y) 가이드라인을 준수하는지 확인합니다.