/**
 * Rate Limiter for npm API calls
 * 
 * Simple implementation: Maximum calls per time window
 * This prevents 429 rate limit errors from npm API.
 */

class RateLimiter {
  private queue: number[] = [];
  private maxCalls: number;
  private timeWindow: number;

  constructor(maxCalls: number, timeWindowMs: number) {
    this.maxCalls = maxCalls;
    this.timeWindow = timeWindowMs;
  }

  /**
   * Wait until we can make another API call
   */
  async waitForSlot(): Promise<void> {
    const now = Date.now();
    
    // Remove calls outside the time window
    this.queue = this.queue.filter(time => now - time < this.timeWindow);
    
    // If we've hit the limit, wait
    if (this.queue.length >= this.maxCalls) {
      const oldestCall = this.queue[0];
      const waitTime = this.timeWindow - (now - oldestCall) + 50; // +50ms buffer
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.waitForSlot(); // Recursive check
    }
    
    // Record this call
    this.queue.push(now);
  }

  /**
   * Reset the rate limiter (e.g., after detecting 429)
   */
  reset(): void {
    this.queue = [];
  }
}

/**
 * Create a rate limiter for npm Downloads API
 * 4 calls per 1 second = 4 calls/second = 240 calls/minute
 * Conservative rate to avoid 429 errors
 */
export function createNpmDownloadsRateLimiter(): RateLimiter {
  return new RateLimiter(4, 1000);
}

/**
 * Create a rate limiter for npm Registry Search API
 * 3 calls per 1 second (more conservative)
 */
export function createNpmSearchRateLimiter(): RateLimiter {
  return new RateLimiter(3, 1000);
}

export default RateLimiter;
