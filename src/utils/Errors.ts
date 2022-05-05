["uncaughtException", "uncaughtExceptionMonitor", "unhandledRejection"].forEach(
  (x) => process.on(x, () => {})
);
