"use client";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FormField {
  value: any;
  rules?: ValidationRule;
  error?: string;
}

export interface FormState {
  [key: string]: FormField;
}

export class FormValidator {
  static validateField(value: any, rules?: ValidationRule): string | null {
    if (!rules) return null;

    // Required validation
    if (rules.required && (!value || value.toString().trim() === "")) {
      return "This field is required";
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === "") {
      return null;
    }

    const stringValue = value.toString();

    // Min length validation
    if (rules.minLength && stringValue.length < rules.minLength) {
      return `Minimum ${rules.minLength} characters required`;
    }

    // Max length validation
    if (rules.maxLength && stringValue.length > rules.maxLength) {
      return `Maximum ${rules.maxLength} characters allowed`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      return "Invalid format";
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }

  static validateForm(formState: FormState): { isValid: boolean; errors: { [key: string]: string } } {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    Object.keys(formState).forEach(key => {
      const field = formState[key];
      const error = this.validateField(field.value, field.rules);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  static getFieldError(formState: FormState, fieldName: string): string | undefined {
    return formState[fieldName]?.error;
  }
}

// Common validation rules
export const ValidationRules = {
  required: { required: true },
  email: { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  phone: { 
    required: true, 
    pattern: /^[0-9]{10}$/ 
  },
  price: { 
    required: true, 
    custom: (value: any) => {
      const num = Number(value);
      if (isNaN(num) || num < 0) return "Price must be a positive number";
      return null;
    }
  },
  stock: { 
    required: true, 
    custom: (value: any) => {
      const num = Number(value);
      if (isNaN(num) || num < 0) return "Stock must be a positive number";
      return null;
    }
  },
  name: { 
    required: true, 
    minLength: 2, 
    maxLength: 100 
  },
  description: { 
    maxLength: 1000 
  },
  sku: { 
    required: true, 
    minLength: 3, 
    maxLength: 50,
    pattern: /^[A-Za-z0-9-_]+$/
  }
};