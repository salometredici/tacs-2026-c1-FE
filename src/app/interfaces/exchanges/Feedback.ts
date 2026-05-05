/**
 * Feedback dejado por una de las partes. El reviewer queda implícito por el slot
 * (`feedbackFromA` o `feedbackFromB`) en el que vive.
 */
export interface Feedback {
  score: number;
  comment?: string;
  createdAt: string;
}
