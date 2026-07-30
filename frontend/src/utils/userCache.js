// In-memory cache for Contestant / Student Portal data with Gold Standard Stale-While-Revalidate (SWR) + 60s Timestamp Cooldown
export const userCache = {
  team: null,
  invitations: null,
  project: null,
  problems: null,

  // Timestamps (ms) when data was last fetched from the server
  lastFetched: {
    team: 0,
    invitations: 0,
    project: 0,
    problems: 0
  },

  // Time-to-live (Cooldown) duration: 60 seconds
  TTL: 60 * 1000,

  /**
   * Check if cached data exists and is fresher than the TTL cooldown.
   * @param {'team' | 'invitations' | 'project' | 'problems'} key
   * @returns {boolean}
   */
  isFresh(key) {
    if (!this.lastFetched[key]) return false;
    return Date.now() - this.lastFetched[key] < this.TTL;
  },

  /**
   * Store fetched data and record timestamp.
   * @param {'team' | 'invitations' | 'project' | 'problems'} key
   * @param {any} data
   */
  set(key, data) {
    this[key] = data;
    this.lastFetched[key] = Date.now();
  },

  /**
   * Mark a specific key (or all keys) as stale so the next visit triggers a silent revalidate.
   * @param {'team' | 'invitations' | 'project' | 'problems'} [key]
   */
  invalidate(key) {
    if (key) {
      this.lastFetched[key] = 0;
    } else {
      this.lastFetched.team = 0;
      this.lastFetched.invitations = 0;
      this.lastFetched.project = 0;
      this.lastFetched.problems = 0;
    }
  },

  /**
   * Clear all data and timestamps (e.g., on logout).
   */
  clear() {
    this.team = null;
    this.invitations = null;
    this.project = null;
    this.problems = null;
    this.lastFetched.team = 0;
    this.lastFetched.invitations = 0;
    this.lastFetched.project = 0;
    this.lastFetched.problems = 0;
  }
};
