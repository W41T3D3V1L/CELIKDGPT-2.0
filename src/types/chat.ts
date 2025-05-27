export interface CodeBlock {
  code: string;
  language: string;
  explanation?: string;
}

export interface Message {
  id: string;
  text: string; // Will store explanation for code messages, or full text for text messages
  sender: 'user' | 'ai';
  timestamp: Date;
  userName?: string; // Added to hold username for avatar display
  aiModelDetails?: {
    modelName: string;
    directiveInvoked?: boolean;
    reasonForDirective?: string;
  };
  structuredContent?: CodeBlock; // For AI code responses
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
  contractText: string;
}
