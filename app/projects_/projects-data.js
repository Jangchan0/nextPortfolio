export const projectGroups = [
    {
        service: 'Roubit',
        serviceSummary:
            '20만 MAU 규모의 다국어 루틴 관리 서비스에서 React Native 앱과 Next.js WebView를 함께 운영하며 성능·안정성·배포 품질을 개선했습니다.',
        projects: [
            {
                slug: 'roubit-attendance-performance',
                title: '출석체크 시스템 WebView 전환 및 성능 개선',
                period: '2024.06 ~ 2024.10',
                role: '앱/WebView 담당',
                image: {
                    src: '/project-screenshots/roubit-attendance.png',
                    alt: 'Roubit 출석체크 화면',
                },
                screenLabel: '출석체크',
                screenMetric: 'firstLottie 67.5% 개선',
                summary:
                    'Native 중심 출석체크 경험을 Next.js WebView로 전환하고, 초기 진입 성능을 측정 기반으로 개선했습니다.',
                metrics: [
                    { label: 'firstLottieMs', value: '67.5% 개선' },
                    { label: 'networkRequestCount', value: '66.7% 감소' },
                    { label: 'jankFrames', value: '18.2% 감소' },
                ],
                problem:
                    '출석체크는 매일 반복되는 핵심 진입 플로우였지만, Lottie 선택과 재생 시나리오가 복잡하고 초기 네트워크 요청이 많아 첫 화면 체감이 느렸습니다.',
                strategy:
                    '먼저 첫 Lottie 노출 시간, 네트워크 요청 수, jank frame을 기준 지표로 잡고, 사용자에게 체감 가치가 낮은 애니메이션 로직은 줄이는 방향으로 기획팀과 합의했습니다.',
                implementation: [
                    'useLottieSelector에서 pendingAttendanceInfo, colorMode, createAt을 입력값으로 받아 LottieUtil selector가 단일 Lottie만 결정하도록 구조를 바꿨습니다.',
                    'getStreakAnimationScenario로 stopAtMs, playStartDelayMs, staggerMs, fadeOutIndex를 계산하게 분리해 애니메이션 타이밍 정책을 UI 컴포넌트 밖으로 빼냈습니다.',
                    'RoubitLottie는 DotLottiePlayer 재생과 gsap 진입 애니메이션만 담당하도록 좁히고, animationRef로 중복 실행을 막았습니다.',
                    'React Query의 enabled 조건을 Lottie name 존재 여부와 연결해 선택된 리소스만 요청하도록 만들고, 출석 정보 재요청과 Lottie 사전 다운로드를 제거했습니다.',
                    'WebView bridge와 출석 조회/변경 queryFn을 분리해 네이티브 세션 처리와 화면 상태 변경이 서로 영향을 덜 주도록 정리했습니다.',
                ],
                result: [
                    '첫 Lottie 노출 시간이 3370.2ms에서 1094.0ms로 줄어 초기 진입 체감이 개선되었습니다.',
                    '초기 네트워크 요청이 12회에서 4회로 줄어 WebView 진입 시 불필요한 대기와 부하를 낮췄습니다.',
                    '1년차에 작성한 기능을 2년차에 측정 기반으로 다시 설계하며 기획 요구와 클라이언트 성능 비용 사이의 균형점을 찾았습니다.',
                ],
                skills: ['Next.js', 'React', 'TypeScript', 'React Query', 'Zustand', 'Lottie', 'WebView Bridge'],
            },
            {
                slug: 'roubit-android-anr',
                title: 'Android 앱 안정화 및 ANR 개선',
                period: '2024.11 ~ 2025.03',
                role: 'Android 안정화 담당',
                screenLabel: 'ANR 안정화',
                screenMetric: 'ANR 3%대 → 0%대',
                summary:
                    '위젯, 부팅 리시버, 푸시, 딥링크, 네이티브 초기화 경로를 나누어 Android vitals ANR을 개선했습니다.',
                metrics: [
                    { label: 'Android vitals ANR', value: '3%대 → 0%대' },
                    { label: 'Widget alarm', value: '중복 예약 방지' },
                    { label: 'Push deeplink', value: '비정상 경로 차단' },
                ],
                problem:
                    'ANR은 특정 화면 하나가 아니라 위젯 업데이트, 부팅 직후 리시버, 알림 클릭, 네이티브 모듈 초기화처럼 앱 외부에서 진입하는 여러 경로에서 발생했습니다.',
                strategy:
                    '재현이 어려운 Android 안정성 문제를 진입 경로별로 분리하고, Crashlytics와 커밋 단위 수정으로 원인을 좁혀 갔습니다.',
                implementation: [
                    'RNPushNotificationBootEventReceiver 호환 shim을 추가해 기존 설치 앱의 manifest가 오래된 class를 참조해도 BootReceiver로 위임되도록 처리했습니다.',
                    'WidgetUpdateAlarmManager에서 AppWidgetManager.getAppWidgetIds 결과가 비어 있으면 예약을 생략하고, 동일 requestCode의 PendingIntent를 cancel한 뒤 재등록해 부팅 후 중복 예약을 줄였습니다.',
                    'Android 12 이상 exact alarm 권한 유무에 따라 setExactAndAllowWhileIdle과 setAndAllowWhileIdle을 분기해 OS 정책 차이를 흡수했습니다.',
                    'Notifee getTriggerNotifications 호출 경로에서 BadParcelableException이 발생할 수 있어 Android에서는 예약 알림 목록 조회를 우회하고 warning을 1회만 남기도록 방어했습니다.',
                    'RetrofitInstance.init(applicationContext)를 MainApplication.onCreate에서 선행하고, requireApplicationContext guard로 초기화 누락을 명시적 오류로 전환했습니다.',
                    'normalizeDeepLinkTo에서 허용된 path와 정규식 패턴만 navigation에 전달해 푸시/웹뷰 딥링크로 인한 cold-start navigation crash를 줄였습니다.',
                ],
                result: [
                    'Android vitals 기준 3%대였던 ANR을 0%대로 낮췄습니다.',
                    '앱 실행 전후로 발생하던 위젯/푸시/부팅 경로의 비정상 종료 가능성을 낮췄습니다.',
                    '화면 구현뿐 아니라 운영 중 앱 안정성 지표를 직접 추적하고 개선하는 경험을 쌓았습니다.',
                ],
                skills: ['React Native', 'Android', 'Kotlin', 'WorkManager', 'Notifee', 'Retrofit', 'Crashlytics'],
            },
            {
                slug: 'roubit-fastlane-release',
                title: 'Android 릴리즈 배포 자동화 및 사전검증 인프라',
                period: '2025.12 ~ 2026.02',
                role: '배포 자동화 담당',
                screenLabel: '배포 자동화',
                screenMetric: '사전검증 8개',
                summary:
                    '로컬 Fastlane 기반 Android 릴리즈 배포 흐름을 구축하고, dev 환경이 prod 배포로 나가지 않도록 사전검증을 자동화했습니다.',
                metrics: [
                    { label: 'Fastlane lane', value: '3개' },
                    { label: 'Predeploy check', value: '8개' },
                    { label: 'Release target', value: 'Play Console + Firebase' },
                ],
                problem:
                    'Android 릴리즈는 수동 확인 항목이 많고, WebView URL/API host/GraphQL header 설정이 잘못되면 dev 환경이 배포 환경으로 나갈 수 있었습니다.',
                strategy:
                    '배포 전 사람이 눈으로 확인하던 항목을 스크립트로 고정하고, 실패 시 배포 명령 자체가 중단되는 fail-fast 구조로 바꿨습니다.',
                implementation: [
                    'Fastfile에 playStore, firebase_aab, firebase_apk lane을 분리해 Play Console draft 업로드와 Firebase App Distribution 배포 경로를 표준화했습니다.',
                    'Release signing 정보는 Fastlane property로 주입하고, 업로드 성공/실패는 Slack webhook으로 알리도록 배포 피드백 루프를 만들었습니다.',
                    'check-fastlane-aos-release-config.js에서 WEBVIEW_URL_PROD, PROD_HOST, roubit-env, JWT 조회 방식, GraphQL uri를 배포 전 정규식 기반으로 검증했습니다.',
                    '스크립트가 실패하면 process.exit(1)로 Fastlane 실행을 중단해 dev host나 고정 dev header가 포함된 빌드가 릴리즈로 나가지 않도록 했습니다.',
                    'package.json script에서 사전검증, Play Console 업로드, Firebase AAB/APK 배포를 하나의 실행 흐름으로 묶어 릴리즈 절차를 코드화했습니다.',
                ],
                result: [
                    'Google Play와 Firebase 배포를 로컬 명령으로 표준화했습니다.',
                    '8개 사전검증으로 dev/prod 환경 혼선을 배포 전에 차단했습니다.',
                    '반복 배포 작업의 휴먼에러 가능성을 줄이고 릴리즈 가이드라인을 코드화했습니다.',
                ],
                skills: ['React Native', 'Fastlane', 'Google Play Console', 'Firebase App Distribution', 'Node.js'],
            },
            {
                slug: 'roubit-graphql-migration',
                title: 'GraphQL 및 TanStack Query 기반 API 마이그레이션',
                period: '2026.03 ~ 2026.04',
                role: 'API 마이그레이션 담당',
                screenLabel: 'GraphQL 마이그레이션',
                screenMetric: '10개+ 도메인 전환',
                summary:
                    'Axios/Apollo 기반 레거시 호출을 GraphQL request와 TanStack Query 중심으로 전환하며 도메인별 마이그레이션을 진행했습니다.',
                metrics: [
                    { label: 'Migration domains', value: '10개+' },
                    { label: 'Migration commits', value: '80개+' },
                    { label: 'Tracking', value: 'Sentry/Slack 기반' },
                ],
                problem:
                    '레거시 API 호출 방식이 Axios, Apollo, GraphQL request로 나뉘어 있어 타입 안정성, 캐싱 정책, 장애 추적 방식이 일관되지 않았습니다.',
                strategy:
                    '한 번에 전체를 바꾸기보다 루틴, 투두, 목표, 보상, 컬렉션 등 도메인 단위로 쪼개고, 레거시 호출이 남아 있는 지점을 추적 가능하게 만들었습니다.',
                implementation: [
                    'gqlQuery.ts에 도메인별 operation을 모으고 queryFn 레이어에서 schema 기반 output type을 명시해 API 응답 shape를 컴파일 단계에서 확인했습니다.',
                    'Routine, Todo, Goal, Collection, Mission, Reward 등 도메인별 queryKey를 분리해 캐시 무효화 범위를 좁혔습니다.',
                    'Axios/Apollo 기반 호출을 한 번에 제거하지 않고, 사용자 플로우별로 GraphQL request + TanStack Query로 교체해 배포 단위 회귀 리스크를 낮췄습니다.',
                    'SentryGraphQLClient wrapper로 request 성공/실패 breadcrumb를 남겨 operationName, query, variables, fetchResult를 장애 분석에 활용할 수 있게 했습니다.',
                    '레거시 API 추적 로그를 활성화해 마이그레이션 중 남아 있는 호출을 운영 환경에서 발견할 수 있는 관측 지점을 만들었습니다.',
                ],
                result: [
                    '도메인별 API 호출 구조가 명확해져 신규 기능 추가와 회귀 확인 비용이 줄었습니다.',
                    '마이그레이션 진행 상황을 커밋과 로그로 추적할 수 있어 대규모 전환의 운영 리스크를 낮췄습니다.',
                    '캐싱과 에러 추적 방식을 프론트엔드 레이어에서 일관되게 다룰 수 있는 기반을 마련했습니다.',
                ],
                skills: ['GraphQL', 'TanStack Query', 'TypeScript', 'Sentry', 'React Native', 'Next.js'],
            },
            {
                slug: 'roubit-theme-customizing',
                title: '꾸미기/테마 WebView 제품화 및 운영',
                period: '2024.12 ~ 2026.04',
                role: '꾸미기/WebView 담당',
                images: [
                    {
                        src: '/project-screenshots/roubit-customizing-costume.png',
                        alt: 'Roubit 꾸미기 의상 장착 화면',
                    },
                    {
                        src: '/project-screenshots/roubit-customizing-room.png',
                        alt: 'Roubit 꾸미기 방 테마 화면',
                    },
                ],
                screenLabel: '꾸미기/테마',
                screenMetric: '방 12 + 의상 4',
                summary:
                    '루빗 방 꾸미기, 의상 장착, 테마 상세, 장바구니 구매 흐름을 WebView와 React Native 앱 경계에서 운영했습니다.',
                metrics: [
                    { label: 'Room categories', value: '12개' },
                    { label: 'Costume slots', value: '4개' },
                    { label: 'Locales', value: '8개 언어' },
                ],
                problem:
                    '꾸미기는 단순 아이템 목록이 아니라 방 미리보기, 의상 장착, 테마 상세, 구매 가능 여부, 장바구니, 네이티브 화면 전환이 하나의 흐름으로 이어져야 했습니다.',
                strategy:
                    '서버에 저장된 장착 상태와 사용자가 임시로 선택한 미리보기 상태를 분리하고, WebView 내부 상태와 React Native 네비게이션을 PostMessage 계약으로 연결했습니다.',
                implementation: [
                    'focusedRoomItems 12개 카테고리와 focusedCostumeItems 4개 슬롯을 Zustand로 분리해, 저장 전 미리보기 상태가 실제 장착 상태를 덮어쓰지 않도록 관리했습니다.',
                    'getUserRoom, getThemeAndFurniture, getCostumes, equipItems GraphQL 흐름을 queryFn 레이어로 분리해 방/의상/테마 상세 데이터를 화면별로 재사용했습니다.',
                    'wall_paper, floor, interior item을 RoomPreview 단위로 나누고 GetRoomPreviewItemSize/Position 유틸로 아이템 배치 규칙을 계산해 테마별 방 구성을 안정적으로 렌더링했습니다.',
                    'checkPurchaseableItems, updateCartSelection, completePurchaseWithCartSession, resetCachedItems 흐름으로 장바구니 구매 가능 여부와 구매 완료 상태를 화면 상태와 연결했습니다.',
                    'Customizing, ThemeDetail WebView URL에 token/productId를 주입하고 navToCustomizing, navToChallengeThemeDetail, customizingSaved PostMessage로 네이티브 스택과 저장 피드백을 연결했습니다.',
                    '시즌 테마 asset map과 8개 언어 번역 리소스를 함께 추가해 신규 테마가 홈/꾸미기/테마 상세 화면에 일관되게 노출되도록 운영했습니다.',
                ],
                result: [
                    '사용자가 구매 또는 저장 전에 방과 의상을 미리 조합해 볼 수 있는 꾸미기 경험을 만들었습니다.',
                    '방 12개 카테고리와 의상 4개 슬롯을 같은 저장/구매 흐름 안에서 다루며 복잡한 상태 전이를 화면별로 분리했습니다.',
                    '시즌 테마와 다국어 리소스를 반복적으로 추가할 수 있는 구조를 마련해 콘텐츠 운영 비용을 낮췄습니다.',
                ],
                skills: ['Next.js', 'React', 'TypeScript', 'React Native WebView', 'GraphQL', 'Zustand', 'TanStack Query'],
            },
        ],
    },
    {
        service: 'Loody',
        serviceSummary:
            'AI 버디 서비스 Loody를 Expo 기반으로 0→1 구축하며 에셋 동기화, 실시간 채팅·음성통화, 하드웨어 페어링 경험을 설계했습니다.',
        projects: [
            {
                slug: 'loody-asset-sync',
                title: '에셋 동기화 및 로컬 DB 구조 구축',
                period: '2025.03 ~ 2025.07',
                role: '0→1 기능 설계/구현',
                image: {
                    src: '/project-screenshots/loody-asset-sync.png',
                    alt: 'Loody 에셋 동기화 화면',
                },
                screenLabel: '에셋 동기화',
                screenMetric: '최대 20개 병렬',
                summary:
                    '버디 outfit/action/voice 에셋을 로컬 파일 시스템과 SQLite DB로 관리하고, 다운로드 병렬 처리 구조를 만들었습니다.',
                metrics: [
                    { label: 'Asset types', value: '3개' },
                    { label: 'Download concurrency', value: '1개 → 최대 20개' },
                    { label: 'Retry policy', value: '최대 5회' },
                ],
                problem:
                    '초기 구조는 서버에서 받은 에셋을 하나씩 직렬 다운로드하는 방식이라, 앱 초기 진입과 리소스 업데이트 시간이 에셋 수에 비례해 길어졌습니다.',
                strategy:
                    '에셋을 outfit/action/voice로 모델링하고, 파일 크기 기반 정렬과 chunk 병렬 처리로 사용자 대기 시간을 줄이는 구조를 선택했습니다.',
                implementation: [
                    'Drizzle schema에서 outfits, actions, voices 테이블을 분리해 화면 리소스, 행동 애니메이션, 음성 리소스의 버전과 로컬 path를 독립적으로 관리했습니다.',
                    'compareAssetData로 서버 최신 manifest와 로컬 manifest의 차이를 계산하고, enrichTasksWithFileSize로 다운로드 태스크에 파일 크기 정보를 주입했습니다.',
                    'processServerDatasWithProgress에서 태스크를 fileSize 기준으로 정렬한 뒤 chunkArray로 최대 20개씩 묶어 작은 파일부터 병렬 처리되도록 했습니다.',
                    'processChunk는 Promise.all로 chunk 내부 태스크를 동시에 처리하고, 실패 시 최대 5회 exponential backoff로 재시도해 일시적 네트워크 실패를 흡수했습니다.',
                    'createProgressTracker 클로저로 completed count를 캡슐화하고, 각 태스크 완료 시 전체 progress를 계산해 UI 상태와 동기화했습니다.',
                ],
                result: [
                    '직렬 1개 처리 구조를 최대 20개 병렬 처리 구조로 바꿔 대량 에셋 동기화의 병목을 줄였습니다.',
                    '서버 최신 데이터, 로컬 파일, 로컬 DB 상태를 비교 가능한 형태로 분리해 업데이트 판단이 쉬워졌습니다.',
                    '에셋 다운로드 실패, 디스크 공간 부족, 네트워크 오류 같은 예외 흐름을 화면 상태와 연결할 수 있는 기반을 만들었습니다.',
                ],
                skills: ['Expo', 'React Native', 'SQLite', 'Drizzle', 'FileSystem', 'GraphQL', 'Zustand'],
            },
            {
                slug: 'loody-realtime-chat-voice',
                title: 'WebSocket 기반 채팅/음성통화 핵심 경험 개발',
                period: '2025.04 ~ 2025.10',
                role: '실시간 통신/음성 경험 담당',
                image: {
                    src: '/project-screenshots/loody-realtime.png',
                    alt: 'Loody 실시간 통신 화면',
                },
                screenLabel: '실시간 통신',
                screenMetric: 'typed event 21개',
                summary:
                    'AI 버디와의 텍스트 채팅, 음성통화, 음성 스트리밍을 하나의 typed WebSocket 세션 흐름으로 연결했습니다.',
                metrics: [
                    { label: 'Typed event', value: '21개' },
                    { label: 'Reconnect', value: '최대 5회' },
                    { label: 'Audio stream', value: '16kHz mono PCM' },
                ],
                problem:
                    'AI 버디 경험은 단순 메시지 송수신을 넘어 세션 연결, 재연결, ping/pong, 음성 입력, 응답 스트리밍, 통화 중단 상황까지 함께 처리해야 했습니다.',
                strategy:
                    '클라이언트/서버 이벤트를 타입으로 고정하고, 연결 상태와 음성 스트리밍 상태를 분리해 예외 상황을 단계적으로 처리했습니다.',
                implementation: [
                    'socket.eventMessage.client/server type에 CONNECT, RECONNECT, PING/PONG, MESSAGE_ACK/RES/ERR, voice response event를 enum과 discriminated type으로 고정했습니다.',
                    'useChatSocketConnection에서 connectionState, reconnectAttempts를 store로 관리하고, 1초 기반 exponential backoff로 최대 5회 재연결하도록 했습니다.',
                    'useConnectSocketHandler와 ResEventMessageHandlerUtil로 onopen/onmessage/onclose/onerror 책임을 분리해 이벤트 종류별 handler를 교체하기 쉽게 만들었습니다.',
                    'useAudioStreamer에서 @siteed/expo-audio-studio 설정을 16kHz, mono, pcm_16bit, 32ms interval로 고정하고 audio_stream payload를 WebSocket으로 전송했습니다.',
                    'useNavToVoiceChat에서 중복 세션, 구독/무료 체험, 마이크/통화 권한, 실제 통화 중 여부를 guard pipeline으로 분리해 진입 실패 원인을 UI로 돌려줬습니다.',
                ],
                result: [
                    '채팅과 음성통화를 같은 세션 모델 안에서 관리해 실시간 경험의 상태 전이를 단순화했습니다.',
                    '네트워크 불안정 상황에서도 재연결 정책으로 일시적 연결 실패를 자동 복구할 수 있게 했습니다.',
                    '음성 입력과 AI 응답 이벤트를 UI 상태와 연결해 통화형 UX를 구현했습니다.',
                ],
                skills: ['React Native', 'Expo', 'WebSocket', 'TypeScript', 'Zustand', 'Audio Streaming'],
            },
            {
                slug: 'loody-hardware-otp-sse',
                title: '전용 하드웨어 OTP/SSE 페어링 기능 구축',
                period: '2025.10 ~ 2025.11',
                role: '하드웨어 연동 플로우 담당',
                screenLabel: 'OTP/SSE 페어링',
                screenMetric: 'SSE 기반 연결',
                summary:
                    '전용 하드웨어와 앱 계정을 OTP로 연결하고, SSE 이벤트로 연결 완료/만료 상태를 반영하는 페어링 흐름을 구축했습니다.',
                metrics: [
                    { label: 'Pairing API', value: '4개 흐름' },
                    { label: 'SSE events', value: 'device_connected / otp_expired' },
                    { label: 'Connection guard', value: '중복 연결 방지' },
                ],
                problem:
                    '하드웨어 페어링은 앱, 서버, 기기 상태가 동시에 맞아야 하며, OTP 만료나 중복 연결, 뒤로가기, 연결 해제 같은 예외 처리가 중요했습니다.',
                strategy:
                    'OTP 생성/무효화와 SSE 연결/종료 책임을 분리하고, 페어링 시작과 종료를 하나의 hook에서 조합하는 구조로 정리했습니다.',
                implementation: [
                    'createOtpRequest, voidOtp, getConnectedDevices, deviceUnlink query/mutation을 분리해 페어링 생성, 만료, 조회, 해제 흐름을 각각 추적 가능하게 했습니다.',
                    'useSSEConnection에서 react-native-sse EventSource ref를 싱글톤처럼 관리하고, 이미 연결된 경우 connectSSE가 중복 연결을 만들지 않도록 guard했습니다.',
                    'SSE_OTP_EVENT_TYPE을 enum으로 정의해 device_connected, otp_expired 이벤트 리스너 등록을 문자열 분산 없이 관리했습니다.',
                    'useOtpPairing에서 connectSSE → createOtpRequest, disconnectSSE → voidOtp → resetOtpState 순서로 시작/종료 트랜잭션을 명확히 했습니다.',
                    '연결 해제 후 prefetch 대신 invalidateQueries로 전환해 서버 상태를 다시 조회하도록 만들고, 뒤로가기/종료 시 잔여 OTP 상태를 정리했습니다.',
                ],
                result: [
                    '전용 하드웨어를 앱 계정에 연결하고 해제하는 전체 사용자 흐름을 앱 안에서 처리할 수 있게 했습니다.',
                    'SSE와 OTP 상태를 함께 초기화해 만료/취소/뒤로가기 상황의 잔여 연결 리스크를 낮췄습니다.',
                    '하드웨어 연동이라는 앱 외부 상태를 프론트엔드 상태 모델 안에서 안정적으로 다루는 경험을 쌓았습니다.',
                ],
                skills: ['React Native', 'Expo', 'SSE', 'GraphQL', 'TanStack Query', 'Zustand'],
            },
            {
                slug: 'loody-zero-to-one',
                title: 'Expo 기반 앱 0→1 초기 구축',
                period: '2025.02 ~ 2025.05',
                role: '초기 앱 구조 설계/구현',
                screenLabel: '신규 앱 제품화',
                screenMetric: 'Expo 기반 구축',
                summary:
                    '신규 AI 버디 앱의 라우팅, 인증, 다국어, 분석, API 통신, 초기 사용자 플로우를 처음부터 구축했습니다.',
                metrics: [
                    { label: 'Platform', value: 'Expo RN' },
                    { label: 'Auth', value: 'Google / Apple' },
                    { label: 'Product analytics', value: 'Mixpanel / Hackle' },
                ],
                problem:
                    '신규 서비스는 제품 검증 속도가 중요했기 때문에, 앱 구조가 빠르게 기능을 얹을 수 있으면서도 인증, 분석, 다국어, API 통신 기반을 갖춰야 했습니다.',
                strategy:
                    'Expo Router와 TypeScript를 기반으로 앱의 화면 흐름을 잡고, 기능 개발 초반부터 분석 이벤트와 실험 기반을 함께 넣었습니다.',
                implementation: [
                    'Expo Router 기반 app directory를 구성하고, onboarding, assetSyncer, home, chat, buddy, settings 도메인을 화면 경로 단위로 분리했습니다.',
                    'GraphQL client, TanStack Query provider, Zustand store, AsyncStorage manager를 초기 provider 계층에 연결해 기능별 상태 관리 방식을 통일했습니다.',
                    'Google/Apple 로그인과 Firebase 연동을 온보딩 플로우에 붙이고, 계정 연결 실패/중복 계정/권한 안내를 UI 상태로 처리했습니다.',
                    'i18n 리소스와 Pretendard/PretendardJP 폰트를 함께 구성해 한국어/일본어/영어 확장성을 초기부터 고려했습니다.',
                    'Mixpanel event key와 Hackle experiment setup을 초기 구조에 포함해 기능 출시 후 사용자 행동과 실험 결과를 추적할 수 있게 했습니다.',
                ],
                result: [
                    '아이디어 단계의 서비스를 실제 QA와 배포가 가능한 앱 구조로 만들었습니다.',
                    '이후 채팅, 음성통화, 에셋 동기화, 구독, 하드웨어 연동 기능을 얹을 수 있는 기반을 마련했습니다.',
                    '0→1 제품에서 기능 구현뿐 아니라 관측, 실험, 인증, 다국어까지 함께 고려하는 개발 방식을 경험했습니다.',
                ],
                skills: ['Expo', 'React Native', 'TypeScript', 'Expo Router', 'Firebase', 'GraphQL', 'i18n', 'Mixpanel'],
            },
        ],
    },
];
