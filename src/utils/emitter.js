// src/utils/emitter.js
const listeners = new Map(); // Map<string, Set<Function>>

function on(event, handler) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(handler);
}

function off(event, handler) {
  const set = listeners.get(event);
  if (!set) return;
  set.delete(handler);
  if (set.size === 0) listeners.delete(event);
}

function emit(event, payload) {
  const set = listeners.get(event);
  if (!set) return;
  for (const h of set) {
    try { h(payload); } catch (e) { console.error(e); }
  }
}

export default { on, off, emit };
