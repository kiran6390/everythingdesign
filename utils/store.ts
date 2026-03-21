type State = {
  onboarded: boolean;
  userName: string;
  enrolledCourses: string[];
  completedLessons: string[];
  currentCourseId: string;
  streak: number;
  xp: number;
};

const state: State = {
  onboarded: false,
  userName: "Emma",
  enrolledCourses: ["1", "2"],
  completedLessons: ["1-1", "1-2"],
  currentCourseId: "1",
  streak: 7,
  xp: 250,
};

const listeners = new Set<() => void>();
function notify() { listeners.forEach((l) => l()); }

export const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
export const getSnapshot = () => state;

export function setOnboarded(name: string) {
  state.onboarded = true;
  state.userName = name || "Emma";
  notify();
}

export function enrollCourse(id: string) {
  if (!state.enrolledCourses.includes(id)) {
    state.enrolledCourses = [...state.enrolledCourses, id];
    notify();
  }
}

export function completeLesson(id: string) {
  if (!state.completedLessons.includes(id)) {
    state.completedLessons = [...state.completedLessons, id];
    state.xp += 20;
    notify();
  }
}
