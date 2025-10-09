export interface KnowledgeBase {
  id: number;
  name: string;
  description: string;
  chunking_strategy_id: number;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface KnowledgeBaseEntry {
  id: string;
  content: string;
  metadata: Record<string, any>;
  similarity?: number;
  knowledgeBaseId?: number;
}

export interface CreateKnowledgeBaseRequest {
  name: string;
  description: string;
  chunkingStrategyId: number;
}

export interface CreateKnowledgeBaseEntryRequest {
  content: string;
  knowledgeBaseId: number;
  options?: {
    chunkSize?: number;
    chunkOverlap?: number;
  };
  metadata?: {
    category?: string;
    [key: string]: any;
  };
}

export interface CompareVectorRequest {
  prompt: string;
  knowledgeBaseId: number;
  threshold: number;
  limiter?: number;
}