// utils/logger.util.ts
import { test } from '@playwright/test';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: Record<string, any>;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private context: string;
  private logs: LogEntry[] = [];
  private enableConsole: boolean = true;
  private enableTestInfo: boolean = true;

  private constructor(context: string = 'Default', logLevel: LogLevel = LogLevel.INFO) {
    this.context = context;
    this.logLevel = logLevel;
  }

  /**
   * Get singleton instance of Logger
   */
  public static getInstance(context?: string, logLevel?: LogLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(context, logLevel);
    }
    return Logger.instance;
  }

  /**
   * Create a new logger instance with specific context
   */
  public static createLogger(context: string, logLevel: LogLevel = LogLevel.INFO): Logger {
    return new Logger(context, logLevel);
  }

  /**
   * Set the minimum log level
   */
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Set the context for this logger
   */
  public setContext(context: string): void {
    this.context = context;
  }

  /**
   * Enable or disable console logging
   */
  public setConsoleLogging(enabled: boolean): void {
    this.enableConsole = enabled;
  }

  /**
   * Enable or disable Playwright test info logging
   */
  public setTestInfoLogging(enabled: boolean): void {
    this.enableTestInfo = enabled;
  }

  /**
   * Log a debug message
   */
  public debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Log an info message
   */
  public info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Log a warning message
   */
  public warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Log an error message
   */
  public error(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, metadata);
  }

  /**
   * Log a fatal error message
   */
  public fatal(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, metadata);
  }

  /**
   * Log action start (useful for page object methods)
   */
  public actionStart(action: string, details?: Record<string, any>): void {
    this.info(`🚀 Starting: ${action}`, details);
  }

  /**
   * Log action success
   */
  public actionSuccess(action: string, details?: Record<string, any>): void {
    this.info(`✅ Success: ${action}`, details);
  }

  /**
   * Log action failure
   */
  public actionFailure(action: string, error: Error | string, details?: Record<string, any>): void {
    const errorMessage = error instanceof Error ? error.message : error;
    this.error(`❌ Failed: ${action} - ${errorMessage}`, details);
  }

  /**
   * Log page navigation
   */
  public pageNavigation(url: string, pageName?: string): void {
    this.info(`🔗 Navigating to ${pageName || 'page'}: ${url}`);
  }

  /**
   * Log element interaction
   */
  public elementInteraction(action: string, element: string, value?: string): void {
    const valueText = value ? ` with value: ${value}` : '';
    this.info(`🎯 ${action} on element: ${element}${valueText}`);
  }

  /**
   * Log validation/assertion
   */
  public assertion(description: string, passed: boolean, expected?: any, actual?: any): void {
    if (passed) {
      this.info(`✅ Assertion passed: ${description}`);
    } else {
      this.error(`❌ Assertion failed: ${description}`, { expected, actual });
    }
  }

  /**
   * Log test step
   */
  public step(stepName: string, details?: Record<string, any>): void {
    this.info(`📋 Step: ${stepName}`, details);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    if (level < this.logLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      context: this.context,
      metadata
    };

    this.logs.push(logEntry);

    if (this.enableConsole) {
      this.logToConsole(logEntry);
    }

    if (this.enableTestInfo) {
      this.logToTestInfo(logEntry);
    }
  }

  /**
   * Log to console with appropriate styling
   */
  private logToConsole(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const contextText = entry.context ? `[${entry.context}]` : '';
    const metadataText = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : '';
    const fullMessage = `${entry.timestamp} ${levelName} ${contextText} ${entry.message}${metadataText}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(fullMessage);
        break;
      case LogLevel.INFO:
        console.log(fullMessage);
        break;
      case LogLevel.WARN:
        console.warn(fullMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(fullMessage);
        break;
    }
  }

  /**
   * Log to Playwright test info
   */
  private logToTestInfo(entry: LogEntry): void {
    try {
      const levelName = LogLevel[entry.level];
      const contextText = entry.context ? `[${entry.context}]` : '';
      const metadataText = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : '';
      const message = `${levelName} ${contextText} ${entry.message}${metadataText}`;
      
      // Use Playwright's test.info() to add to test results
      test.info().annotations.push({
        type: levelName.toLowerCase(),
        description: message,
      });
    } catch (error) {
      // Silently fail if test.info() is not available (e.g., outside test context)
    }
  }

  /**
   * Get all logs
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs to JSON string
   */
  public exportLogsAsJson(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Download logs as JSON file (browser environment)
   */
  public downloadLogsAsFile(fileName: string = 'test-logs.json'): void {
    try {
      const logsJson = this.exportLogsAsJson();
      const blob = new Blob([logsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      this.info(`Logs downloaded as: ${fileName}`);
    } catch (error) {
      this.error(`Failed to download logs: ${error}`);
    }
  }

  /**
   * Create a child logger with additional context
   */
  public createChild(childContext: string): Logger {
    const fullContext = `${this.context}.${childContext}`;
    return Logger.createLogger(fullContext, this.logLevel);
  }
}

// Export convenience functions for common logging patterns
export const createPageLogger = (pageName: string): Logger => {
  return Logger.createLogger(`Page.${pageName}`, LogLevel.INFO);
};

export const createTestLogger = (testName: string): Logger => {
  return Logger.createLogger(`Test.${testName}`, LogLevel.INFO);
};

export const createUtilLogger = (utilName: string): Logger => {
  return Logger.createLogger(`Util.${utilName}`, LogLevel.INFO);
};

// Default logger instance
export const logger = Logger.getInstance('Global', LogLevel.INFO);