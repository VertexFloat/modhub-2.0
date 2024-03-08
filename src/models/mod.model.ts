export type TModLabel = "new" | "prefab" | "update"
export type TModStatus = "pending" | "new" | "review" | "released" | "pending_release" | "testing" | "console_testing"

export interface IMod {
  id: string;
  name: string;
  author: string;
  rating: number;
  ratingCount?: number;
  description?: string;
  iconUrl?: string;
  label?: TModLabel;
  status?: TModStatus;
}