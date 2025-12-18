export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface MapData {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets: {
        reviewText: string;
      }[];
    }[];
  };
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  groundingChunks?: GroundingChunk[];
}

export interface ChatSession {
  id: string;
  messages: Message[];
  language: 'en' | 'ur';
}

export type Language = 'en' | 'ur';