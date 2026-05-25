/**
 * Espeja el {@code CreatedResponseDto<T>} del BE — envelope estándar para responses
 * de POST que crean un recurso. El campo {@code data} contiene el DTO recién creado.
 */
export interface CreatedResponse<T> {
  timestamp: string;
  message: string;
  data: T;
}
