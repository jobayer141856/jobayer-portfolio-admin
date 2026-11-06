import { FormGroup } from '@angular/forms';
import { ProblemDetails } from '../models/common.model';

export function mapBackendValidationErrors(form: FormGroup, error: any): string[] {
  const genericErrors: string[] = [];

  const problem: ProblemDetails = error?.error || error;
  if (!problem || !problem.errors) {
    if (problem?.detail) {
      genericErrors.push(problem.detail);
    } else if (problem?.title) {
      genericErrors.push(problem.title);
    }
    return genericErrors;
  }

  for (const [field, rawMessages] of Object.entries(problem.errors)) {
    const messages = Array.isArray(rawMessages) ? (rawMessages as string[]) : [String(rawMessages)];
    const camelField = field.charAt(0).toLowerCase() + field.slice(1);
    const control = form.get(camelField) || form.get(field);

    if (control) {
      control.setErrors({ backend: messages.join(' ') });
      control.markAsTouched();
    } else {
      genericErrors.push(`${field}: ${messages.join(' ')}`);
    }
  }

  return genericErrors;
}
