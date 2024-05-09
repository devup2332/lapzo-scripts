export interface ICourse {
  id: string;
  name: string;
  provider?: {
    id: string;
    name: string;
    alias?: string | null;
    iconUrl?: string | null;
    imageUrl?: string | null;
    backgroundColor?: string | null;
  };
}
