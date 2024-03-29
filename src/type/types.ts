// types.ts
export interface Message {
    role: string;
    content: string;
    isContinuing?: boolean; 
    avatar: string;
  }
  