import winston from 'winston';
import Joi from 'joi';

// Logger configuration
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-tests' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Schema validation
export const transactionSchema = Joi.object({
  id: Joi.string().required(),
  amount: Joi.number().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  date: Joi.string().isoDate().required(),
  envelope_id: Joi.string().required(),
  account_id: Joi.string().required(),
  created_at: Joi.string().isoDate().optional(),
  updated_at: Joi.string().isoDate().optional()
});

export const apiResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  data: Joi.any().required(),
  message: Joi.string().optional(),
  errors: Joi.array().items(Joi.string()).optional()
});

// Utility functions
export const generateUniqueId = (): string => {
  return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};