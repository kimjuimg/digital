/* ------------------------------------------------------------------
   Firebase 초기화 — citizen.html(학생)과 citizen-teacher.html(선생님)이
   함께 씁니다.

   아래 설정값은 공개되어도 안전한 "주소" 같은 값입니다. 비밀번호가 아닙니다.
   실제 보안은 firestore.rules 에 적힌 규칙이 담당합니다.

   Firebase 프로젝트: kim-digital — 이 수업 전용입니다.
   (파이썬 첫걸음 채점기는 별도의 프로젝트를 쓰므로 서로 영향이 없습니다.)
   컬렉션 이름은 dc_ 로 시작합니다.
------------------------------------------------------------------ */
import { initializeApp }  from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

/* 선생님 계정.
   로그인 화면에는 아이디 "선생님"만 적으면 됩니다. Firebase 로그인은 이메일
   형식을 요구하기 때문에, 화면에서 받은 아이디를 아래 주소로 바꿔 보냅니다.
   이 주소로 메일이 오가지는 않습니다.

   ⚠️ 이 값을 바꾸면 firestore.rules 의 isTeacher() 안에 적힌 주소도 함께
      바꿔야 합니다. 두 곳이 어긋나면 선생님이 순위표를 읽지 못합니다. */
export const TEACHER_ID    = "선생님";
export const TEACHER_EMAIL = "teacher@digital.local";

/* 로그인 칸에 적은 값을 Firebase에 보낼 이메일로 바꾼다.
   선생님 계정은 하나뿐이므로, @ 가 없는 값은 모두 위 주소로 본다. */
export function teacherEmailFor(input){
  const v = String(input == null ? "" : input).trim();
  return v.indexOf("@") === -1 ? TEACHER_EMAIL : v;
}

const firebaseConfig = {
  apiKey:            "AIzaSyDN9bz5tZNzw_HzC9v6Dsj-yV7IGxjSFnY",
  authDomain:        "kim-digital.firebaseapp.com",
  projectId:         "kim-digital",
  storageBucket:     "kim-digital.firebasestorage.app",
  messagingSenderId: "325383370134",
  appId:             "1:325383370134:web:411b39a0633b916f39d9b7"
};

/* 화면마다 Firebase 앱을 따로 만든다.

   Firebase 는 로그인 상태를 브라우저 저장소에 "apiKey:앱이름" 으로 넣어 둔다.
   두 화면이 같은 앱을 쓰면 저장 자리가 같아서, 같은 브라우저에서 학생이
   익명으로 들어오는 순간 선생님 로그인이 덮어써지고 선생님 화면이 로그인
   화면으로 튕겨 나갔다. 앱 이름을 나누면 저장 자리가 갈라져 서로 건드리지
   않는다.

   Firestore 요청은 같은 앱의 로그인 정보를 쓰므로 db 도 함께 나눠야 한다.
   섞으면 학생이 로그인하지 않은 것으로 취급되어 점수 저장이 막힌다. */
const bundles = {};
export function firebaseFor(role){
  if (!bundles[role]) {
    const a = initializeApp(firebaseConfig, role);
    bundles[role] = { app: a, auth: getAuth(a), db: getFirestore(a) };
  }
  return bundles[role];
}

/* 이 수업이 쓰는 컬렉션 이름. 파이썬 첫걸음과 겹치지 않도록 dc_ 를 붙였다. */
export const COL_CLASSES   = "dc_classes";     // 선생님이 연 수업 코드
export const COL_GROUPS    = "dc_groups";      // 모둠별 점수
export const COL_CLASSROOM = "dc_classroom";   // 함께 보기 — 선생님이 지정한 미션

/* 수업 코드 정리 — 영어 대문자와 숫자만, 최대 6자 */
export function cleanCode(v){
  return String(v == null ? "" : v).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

/* 헷갈리는 글자(I, O, 0, 1)를 뺀 알파벳으로 코드를 뽑는다 */
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function randomCode(n){
  let s = "";
  const buf = new Uint32Array(n);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(buf);
    for (let i = 0; i < n; i++) s += CODE_ALPHABET.charAt(buf[i] % CODE_ALPHABET.length);
  } else {
    for (let i = 0; i < n; i++) s += CODE_ALPHABET.charAt(Math.floor(Math.random() * CODE_ALPHABET.length));
  }
  return s;
}

/* 사람이 읽기 좋은 시각 표기 */
export function timeLabel(date){
  if (!date) return "-";
  const p = (n) => String(n).padStart(2, "0");
  return p(date.getMonth() + 1) + "/" + p(date.getDate()) + " " +
         p(date.getHours()) + ":" + p(date.getMinutes());
}
