/** Snapshot mínimo de un User dentro de un Exchange. Inmutable post-creación. */
export interface UserSnapshot {
  userId: string;
  name: string;
  avatarId: string;
}
