export interface ChunkStrategy {
  id: number;
  name: string;
  slug: string;
  description: string;
  updated_at: Date | string;
  created_at: Date | string;
}