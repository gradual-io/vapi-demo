export interface VapiRoomData {
  roomId: string;
  assistantId: string;
  assistantOverrides: {
    firstMessage: string;
    serverUrl: string;
    model: {
      maxTokens: number;
      model: string;
      provider: string;
      temperature: number;
      messages: [{ content: string; role: string }];
    };
  };
}

export type VapiStatus = 'idle' | 'speech-start' | 'speech-end';
