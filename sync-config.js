/* Firebase 웹 앱 설정값.
   Firebase 콘솔 → 프로젝트 설정 → 일반 → 내 앱(웹) 에서 복사한 firebaseConfig 를 아래에 붙여넣는다.
   비어 있으면 기기 연동 기능이 꺼진 상태로 동작한다. (apiKey 는 공개되어도 되는 식별자이며, 접근 제한은 Firestore 규칙이 담당) */
window.FIREBASE_CONFIG = null;
/* 예시:
window.FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "psat-calc.firebaseapp.com",
  projectId: "psat-calc",
  storageBucket: "psat-calc.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
*/
