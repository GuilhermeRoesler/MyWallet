export const DEMO_INTRO_STORAGE_KEY = "mw-demo-intro-dismissed";

export function hasDismissedDemoIntro() {
  return localStorage.getItem(DEMO_INTRO_STORAGE_KEY) === "1";
}

export function dismissDemoIntro() {
  localStorage.setItem(DEMO_INTRO_STORAGE_KEY, "1");
}
