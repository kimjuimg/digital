/* ------------------------------------------------------------------
   Firebase 초기화 — citizen.html(학생)과 citizen-teacher.html(선생님)이
   함께 씁니다.

   아래 설정값은 공개되어도 안전한 "주소" 같은 값입니다. 비밀번호가 아닙니다.
   실제 보안은 firestore.rules 에 적힌 규칙이 담당합니다.

   이 프로젝트는 python-first-steps(파이썬 첫걸음 채점기)와 같은 Firebase
   프로젝트를 씁니다. 자료가 섞이지 않도록 이 수업의 컬렉션 이름은 모두
   dc_ 로 시작합니다.
------------------------------------------------------------------ */
import { initializeApp }  from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

/* 선생님 계정 — 파이썬 첫걸음과 같은 계정을 씁니다.
   로그인 화면에는 아이디 "선생님"만 적으면 됩니다. Firebase 로그인은 이메일
   형식을 요구하기 때문에, 화면에서 받은 아이디를 아래 주소로 바꿔 보냅니다.
   이 주소로 메일이 오가지는 않습니다. */
export const TEACHER_ID    = "선생님";
export const TEACHER_EMAIL = "teacher@python-first-steps.local";

/* 로그인 칸에 적은 값을 Firebase에 보낼 이메일로 바꾼다.
   선생님 계정은 하나뿐이므로, @ 가 없는 값은 모두 위 주소로 본다. */
export function teacherEmailFor(input){
  const v = String(input == null ? "" : input).trim();
  return v.indexOf("@") === -1 ? TEACHER_EMAIL : v;
}

const firebaseConfig = {
  apiKey:            "AIzaSyDBTcaEhoycbZ2C365d5SJakO5NbUB8qcU",
  authDomain:        "project-1714458941779160220.firebaseapp.com",
  projectId:         "project-1714458941779160220",
  storageBucket:     "project-1714458941779160220.firebasestorage.app",
  messagingSenderId: "294844741696",
  appId:             "1:294844741696:web:dd91541566247f21f787a5"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

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
