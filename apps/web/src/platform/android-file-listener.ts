// Lightweight Android file listener integration for WeMD web build
// Place this in apps/web/src/platform/android-file-listener.ts

export function installAndroidFileListener(openHandler: (name: string, text: string) => void) {
  if (typeof window === 'undefined') return;
  window.addEventListener('wemd-file-open', (ev: any) => {
    try {
      const detail = ev.detail || {};
      const name = detail.name || 'file.md';
      const b64 = detail.data || '';
      const text = b64 ? atob(b64) : '';
      openHandler(name, text);
    } catch (err) {
      console.error('Failed to handle incoming file', err);
    }
  });
}
