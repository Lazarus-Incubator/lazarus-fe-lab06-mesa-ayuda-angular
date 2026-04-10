/**
 * App Session Model module.
 *
 * @remarks Provides the TypeScript implementation for `src/app/core/models/app-session.model.ts`.
 */
import { UsuarioRol } from './usuario.model';

export interface AppSession {
  id: number;
  nombreCompleto: string;
  email: string;
  rol: UsuarioRol;
  sedeId: number | null;
}
