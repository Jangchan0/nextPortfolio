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
                screenMetric: '첫 애니메이션 67.5% 개선',
                summary:
                    'Native 중심 출석체크 경험을 Next.js WebView로 전환하고, 초기 진입 성능을 측정 기반으로 개선했습니다.',
                metrics: [
                    { label: '첫 애니메이션 노출', value: '67.5% 개선' },
                    { label: '초기 네트워크 요청', value: '66.7% 감소' },
                    { label: '끊김 프레임', value: '18.2% 감소' },
                ],
                problem:
                    '출석체크는 매일 반복되는 핵심 진입 플로우였지만, Lottie 선택과 재생 시나리오가 복잡하고 초기 네트워크 요청이 많아 첫 화면 체감이 느렸습니다.',
                strategy:
                    '먼저 첫 Lottie 노출 시간, 네트워크 요청 수, jank frame을 기준 지표로 잡고, 사용자에게 체감 가치가 낮은 애니메이션 로직은 줄이는 방향으로 기획팀과 합의했습니다.',
                implementation: [
                    '출석 상태, 테마 색상, 가입 시점에 따라 여러 애니메이션 후보가 동시에 계산되던 구조를 단일 애니메이션만 선택하는 흐름으로 정리했습니다.',
                    '연속 출석 연출의 정지 시점, 재생 지연, 순차 등장, 사라짐 타이밍을 화면 렌더링과 분리해 정책 변경 시 영향 범위를 줄였습니다.',
                    '애니메이션 컴포넌트는 파일 재생과 화면 진입 효과만 담당하도록 역할을 좁히고, 동일 애니메이션이 중복 실행되지 않게 제어했습니다.',
                    '사용자에게 실제로 보여줄 애니메이션이 확정된 뒤에만 리소스를 요청하도록 바꿔 불필요한 출석 정보 재조회와 사전 다운로드를 제거했습니다.',
                    '앱 세션 처리, 출석 데이터 조회, 출석 상태 변경 책임을 분리해 네이티브 앱과 WebView가 서로 영향을 덜 주도록 정리했습니다.',
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
                    // { label: '위젯 알람', value: '중복 예약 방지' },
                    // { label: '푸시 딥링크', value: '비정상 경로 차단' },
                ],
                problem:
                    'ANR은 특정 화면 하나가 아니라 위젯 업데이트, 부팅 직후 리시버, 알림 클릭, 네이티브 모듈 초기화처럼 앱 외부에서 진입하는 여러 경로에서 발생했습니다.',
                strategy:
                    '재현이 어려운 Android 안정성 문제를 진입 경로별로 분리하고, Crashlytics와 커밋 단위 수정으로 원인을 좁혀 갔습니다.',
                implementation: [
                    '기존 설치 앱이 오래된 부팅 리시버 경로로 진입해도 새 위젯 갱신 경로로 안전하게 연결되도록 호환 레이어를 추가했습니다.',
                    '위젯이 없는 상태에서는 알람 예약을 생략하고, 동일한 위젯 갱신 예약은 취소 후 재등록해 부팅 직후 중복 실행 가능성을 낮췄습니다.',
                    'Android 12 이상에서 강화된 정확 알람 권한 정책을 반영해 OS 버전과 권한 상태에 따라 알람 예약 방식을 분기했습니다.',
                    '예약 알림 목록을 조회하는 과정에서 Android 직렬화 예외가 발생할 수 있어, 위험 경로는 우회하고 필요한 경고만 남기도록 방어했습니다.',
                    '앱 시작 시 네이티브 네트워크 모듈을 먼저 초기화하고, 초기화 누락은 조용한 실패가 아니라 명시적인 오류로 드러나도록 바꿨습니다.',
                    '푸시와 WebView 딥링크는 허용된 경로와 패턴만 앱 화면 이동으로 전달해 cold-start 상황의 비정상 navigation을 줄였습니다.',
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
                    { label: '배포 경로', value: '3개' },
                    { label: '사전검증', value: '8개' },
                    { label: '배포 대상', value: 'Play Console + Firebase' },
                ],
                problem:
                    'Android 릴리즈는 수동 확인 항목이 많고, WebView URL/API host/GraphQL header 설정이 잘못되면 dev 환경이 배포 환경으로 나갈 수 있었습니다.',
                strategy:
                    '배포 전 사람이 눈으로 확인하던 항목을 스크립트로 고정하고, 실패 시 배포 명령 자체가 중단되는 fail-fast 구조로 바꿨습니다.',
                implementation: [
                    'Fastfile에 playStore, firebase_aab, firebase_apk lane을 분리해 Play Console draft 업로드와 Firebase App Distribution 배포 경로를 표준화했습니다.',
                    'Release signing 정보는 Fastlane property로 주입하고, 업로드 성공/실패는 Slack webhook으로 알리도록 배포 피드백 루프를 만들었습니다.',
                    '배포 전 검증 스크립트에서 WebView URL, API host, 환경 플래그, 인증 헤더, GraphQL endpoint가 production 기준인지 자동 확인했습니다.',
                    '검증에 실패하면 Fastlane 실행을 즉시 중단해 dev host나 테스트용 header가 포함된 빌드가 릴리즈로 나가지 않도록 했습니다.',
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
                    { label: '전환 도메인', value: '10개+' },
                    { label: '전환 커밋', value: '80개+' },
                    { label: '추적 방식', value: 'Sentry/Slack 기반' },
                ],
                problem:
                    '레거시 API 호출 방식이 Axios, Apollo, GraphQL request로 나뉘어 있어 타입 안정성, 캐싱 정책, 장애 추적 방식이 일관되지 않았습니다.',
                strategy:
                    '한 번에 전체를 바꾸기보다 루틴, 투두, 목표, 보상, 컬렉션 등 도메인 단위로 쪼개고, 레거시 호출이 남아 있는 지점을 추적 가능하게 만들었습니다.',
                implementation: [
                    '루틴, 투두, 목표, 보상, 컬렉션 등 도메인별 GraphQL 호출을 분리하고, schema 기반 타입으로 API 응답 구조를 컴파일 단계에서 확인했습니다.',
                    '도메인별 캐시 키를 분리해 특정 기능의 데이터 변경이 다른 화면 캐시까지 불필요하게 무효화하지 않도록 범위를 좁혔습니다.',
                    'Axios/Apollo 기반 호출을 한 번에 제거하지 않고, 사용자 플로우별로 GraphQL request + TanStack Query로 교체해 배포 단위 회귀 리스크를 낮췄습니다.',
                    'GraphQL 요청 성공/실패 로그를 Sentry breadcrumb로 남겨 어떤 API 호출과 입력값에서 문제가 발생했는지 추적할 수 있게 했습니다.',
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
                screenMetric: '아이템 구성 16개',
                summary:
                    '루빗 방 꾸미기, 의상 장착, 테마 상세, 장바구니 구매 흐름을 WebView와 React Native 앱 경계에서 운영했습니다.',
                metrics: [
                    { label: '전체 아이템 구성', value: '16개 그룹' },
                    { label: '연동 화면', value: '꾸미기/테마/구매' },
                    { label: '지원 언어', value: '8개 언어' },
                ],
                problem:
                    '꾸미기는 단순 아이템 목록이 아니라 방 미리보기, 의상 장착, 테마 상세, 구매 가능 여부, 장바구니, 네이티브 화면 전환이 하나의 흐름으로 이어져야 했습니다.',
                strategy:
                    '저장된 실제 꾸미기 상태와 사용자가 임시로 선택해 보는 미리보기 상태를 분리하고, WebView와 앱 화면 이동은 명확한 메시지 계약으로 연결했습니다.',
                implementation: [
                    '방 꾸미기와 의상 장착을 각각 독립된 미리보기 상태로 관리해, 사용자가 저장하기 전까지 실제 장착 상태가 덮어써지지 않도록 설계했습니다.',
                    '방, 의상, 테마 상세, 장착 요청 데이터를 화면별로 재사용할 수 있게 API 호출 흐름을 분리했습니다.',
                    '벽지, 바닥, 가구처럼 배치 규칙이 다른 아이템을 유형별로 나누고, 아이템 크기와 위치 계산을 공통화해 테마별 방 구성이 깨지지 않도록 렌더링했습니다.',
                    '구매 가능 여부 확인, 장바구니 선택, 구매 완료 후 상태 초기화까지 하나의 사용자 플로우로 연결해 저장/구매 과정의 혼선을 줄였습니다.',
                    '꾸미기 화면과 테마 상세 화면에서 필요한 사용자 세션과 상품 정보를 앱에서 WebView로 전달하고, 저장 완료 후에는 앱 화면에 즉시 피드백되도록 연결했습니다.',
                    '시즌 테마 이미지와 8개 언어 번역 리소스를 함께 관리해 신규 콘텐츠가 홈, 꾸미기, 테마 상세 화면에 일관되게 노출되도록 운영했습니다.',
                ],
                result: [
                    '사용자가 구매 또는 저장 전에 방과 의상을 미리 조합해 볼 수 있는 꾸미기 경험을 만들었습니다.',
                    '방/의상 아이템 16개 구성 단위를 같은 저장/구매 흐름 안에서 다루며 복잡한 상태 전이를 화면별로 분리했습니다.',
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
                    '버디의 외형, 행동 애니메이션, 음성 에셋을 로컬 파일 시스템과 SQLite DB로 관리하고, 다운로드 병렬 처리 구조를 만들었습니다.',
                metrics: [
                    { label: '에셋 유형', value: '3개' },
                    { label: '다운로드 병렬 처리', value: '1개 → 최대 20개' },
                    { label: '재시도 정책', value: '최대 5회' },
                ],
                problem:
                    '초기 구조는 서버에서 받은 에셋을 하나씩 직렬 다운로드하는 방식이라, 앱 초기 진입과 리소스 업데이트 시간이 에셋 수에 비례해 길어졌습니다.',
                strategy:
                    '에셋을 outfit/action/voice로 모델링하고, 파일 크기 기반 정렬과 chunk 병렬 처리로 사용자 대기 시간을 줄이는 구조를 선택했습니다.',
                implementation: [
                    '캐릭터 외형, 행동 애니메이션, 음성 리소스를 로컬 DB에서 독립적으로 관리해 각 리소스의 버전과 저장 경로를 추적할 수 있게 했습니다.',
                    '서버의 최신 에셋 목록과 기기에 저장된 로컬 목록을 비교해 새로 받거나 갱신해야 하는 파일만 다운로드 대상으로 분리했습니다.',
                    '다운로드 대상에 파일 크기 정보를 붙이고 작은 파일부터 처리되도록 정렬한 뒤, 최대 20개씩 묶어 병렬 다운로드되도록 구조를 바꿨습니다.',
                    '일시적인 네트워크 실패는 최대 5회까지 재시도하도록 처리해 대량 에셋 동기화 중 일부 파일 실패가 전체 흐름을 끊지 않도록 했습니다.',
                    '각 파일 다운로드가 끝날 때마다 전체 진행률을 계산해 사용자가 동기화 상태를 화면에서 확인할 수 있게 연결했습니다.',
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
                screenMetric: '이벤트 타입 21개',
                summary:
                    'AI 버디와의 텍스트 채팅, 음성통화, 음성 스트리밍을 하나의 타입 기반 WebSocket 세션 흐름으로 연결했습니다.',
                metrics: [
                    { label: '이벤트 타입', value: '21개' },
                    { label: '재연결', value: '최대 5회' },
                    { label: '음성 스트림', value: '16kHz mono PCM' },
                ],
                problem:
                    'AI 버디 경험은 단순 메시지 송수신을 넘어 세션 연결, 재연결, ping/pong, 음성 입력, 응답 스트리밍, 통화 중단 상황까지 함께 처리해야 했습니다.',
                strategy:
                    '클라이언트/서버 이벤트를 타입으로 고정하고, 연결 상태와 음성 스트리밍 상태를 분리해 예외 상황을 단계적으로 처리했습니다.',
                implementation: [
                    '클라이언트와 서버가 주고받는 21개 이벤트를 연결, 재연결, ping/pong, 메시지 응답, 오류, 음성 응답처럼 역할별로 타입화했습니다.',
                    '연결 상태와 재연결 횟수를 앱 상태로 관리하고, 일시적 네트워크 실패 시 최대 5회까지 단계적으로 재연결하도록 했습니다.',
                    '소켓 연결, 메시지 수신, 연결 종료, 오류 처리 책임을 분리해 이벤트 종류가 늘어나도 특정 처리 흐름만 교체할 수 있게 만들었습니다.',
                    '마이크 입력을 16kHz mono PCM 스트림으로 변환해 WebSocket으로 전송하고, 서버의 음성 응답 이벤트를 통화 UI 상태와 연결했습니다.',
                    '음성통화 진입 전에 중복 세션, 구독/무료 체험 상태, 마이크 권한, 실제 통화 중 여부를 순서대로 검사해 실패 원인을 사용자에게 안내했습니다.',
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
                    { label: '페어링 흐름', value: '4개' },
                    { label: '연결 이벤트', value: '연결 완료 / OTP 만료' },
                    { label: '연결 보호', value: '중복 연결 방지' },
                ],
                problem:
                    '하드웨어 페어링은 앱, 서버, 기기 상태가 동시에 맞아야 하며, OTP 만료나 중복 연결, 뒤로가기, 연결 해제 같은 예외 처리가 중요했습니다.',
                strategy:
                    'OTP 생성/무효화와 SSE 연결/종료 책임을 분리하고, 페어링 시작부터 종료까지의 상태 전이를 하나의 사용자 플로우로 정리했습니다.',
                implementation: [
                    '페어링 생성, OTP 만료, 연결된 기기 조회, 기기 연결 해제를 각각 분리해 사용자가 어느 단계에서 실패했는지 추적할 수 있게 했습니다.',
                    'SSE 연결은 화면 재진입이나 버튼 중복 클릭에도 하나만 유지되도록 막아 중복 이벤트 수신을 방지했습니다.',
                    '하드웨어 연결 완료와 OTP 만료 이벤트를 명확히 구분해, 성공/실패 상태가 화면에 즉시 반영되도록 했습니다.',
                    '페어링 시작 시에는 SSE 연결 후 OTP를 생성하고, 종료 시에는 SSE 연결 해제, OTP 무효화, 화면 상태 초기화를 순서대로 처리했습니다.',
                    '연결 해제 후 서버 상태를 다시 조회하도록 바꾸고, 뒤로가기나 화면 종료 시 남아 있는 OTP 상태를 정리했습니다.',
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
                    { label: '플랫폼', value: 'Expo RN' },
                    { label: '로그인', value: 'Google / Apple' },
                    { label: '제품 분석', value: 'Mixpanel / Hackle' },
                ],
                problem:
                    '신규 서비스는 제품 검증 속도가 중요했기 때문에, 앱 구조가 빠르게 기능을 얹을 수 있으면서도 인증, 분석, 다국어, API 통신 기반을 갖춰야 했습니다.',
                strategy:
                    'Expo Router와 TypeScript를 기반으로 앱의 화면 흐름을 잡고, 기능 개발 초반부터 분석 이벤트와 실험 기반을 함께 넣었습니다.',
                implementation: [
                    '온보딩, 에셋 동기화, 홈, 채팅, 버디, 설정처럼 제품의 주요 화면을 도메인 단위로 나누어 확장 가능한 라우팅 구조를 만들었습니다.',
                    'API 통신, 서버 상태 캐싱, 전역 상태, 로컬 저장소를 앱 초기 계층에 연결해 기능별 상태 관리 방식을 통일했습니다.',
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
