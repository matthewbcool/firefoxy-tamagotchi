class AIEngine {
  async initialize(): Promise<void> {
    // Skip initialization when in dev mode or if "browser" is not defined.
    if (
      process.env.NODE_ENV === 'development' ||
      typeof browser === 'undefined'
    ) {
      console.log('Skipping AI engine initialization.');
      return;
    }
    // Initialize the Firefox ML API engine if available
    if (browser.trial && browser.trial.ml) {
      try {
        await browser.trial.ml.createEngine({
          modelHub: 'mozilla',
          taskName: 'text-to-audio',
        });
      } catch (err) {
        console.error('Error initializing AI engine:', err);
      }
    } else {
      console.warn('Firefox ML API is not available.');
    }
  }
}

export default AIEngine;
