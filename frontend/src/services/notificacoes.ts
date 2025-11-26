import { api } from "./api";

export async function deactivateNotification(id: string): Promise<void> {
  await api.patch(`/notificacao/${id}`, {}, true);
}
