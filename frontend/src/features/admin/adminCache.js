// In-memory cache for Admin Portal data with Gold Standard Stale-While-Revalidate (SWR) + 60s Timestamp Cooldown
export const adminCache = {
  stats: null,
  teams: null,
  members: null,
  settings: null,

  // Timestamps (ms) when data was last fetched from the server
  lastFetched: {
    stats: 0,
    teams: 0,
    members: 0,
    settings: 0
  },

  // Time-to-live (Cooldown) duration: 60 seconds
  TTL: 60 * 1000,

  /**
   * Check if cached data exists and is fresher than the TTL cooldown.
   * @param {'stats' | 'teams' | 'members' | 'settings'} key
   * @returns {boolean}
   */
  isFresh(key) {
    if (!this.lastFetched[key]) return false;
    return Date.now() - this.lastFetched[key] < this.TTL;
  },

  /**
   * Store fetched data and record timestamp.
   * @param {'stats' | 'teams' | 'members' | 'settings'} key
   * @param {any} data
   */
  set(key, data) {
    this[key] = data;
    this.lastFetched[key] = Date.now();
  },

  /**
   * Mark a specific key (or all keys) as stale so the next visit triggers a silent revalidate.
   * @param {'stats' | 'teams' | 'members' | 'settings'} [key]
   */
  invalidate(key) {
    if (key) {
      this.lastFetched[key] = 0;
    } else {
      this.lastFetched.stats = 0;
      this.lastFetched.teams = 0;
      this.lastFetched.members = 0;
      this.lastFetched.settings = 0;
    }
  },

  /**
   * Clear all data and timestamps (e.g., on logout).
   */
  clear() {
    this.stats = null;
    this.teams = null;
    this.members = null;
    this.settings = null;
    this.lastFetched.stats = 0;
    this.lastFetched.teams = 0;
    this.lastFetched.members = 0;
    this.lastFetched.settings = 0;
  }
};
