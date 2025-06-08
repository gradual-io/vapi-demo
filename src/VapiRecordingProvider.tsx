/* eslint-disable no-console */
/* eslint-disable consistent-return */
import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Vapi from '@vapi-ai/web';
import type { OpenAIModel } from '@vapi-ai/web/dist/api';

import { useVapiRecordingActiveStep } from './VapiRecordingActiveStepProvider';
import type { VapiRoomData, VapiStatus } from './vapiTypes';
import { useVapiStore } from './useVapiStore';

const vapi = new Vapi('60f14154-7a5f-411f-8be8-d628cc834779'); // Get Public Token from Dashboard > Accounts Page

interface VapiRecordingContextProps {
  message: string;
  finalMessage: string;
  readyRecording: boolean;
  vapiStatus: VapiStatus;
  setVapiStatus: (status: VapiStatus) => void;
  firstAssistantSpeech: boolean;
}
interface VapiRecordingActionsContextProps {
  startAssistant: (args: {
    selectedAudioDeviceId: string;
    assistantId: VapiRoomData['assistantId'];
    assistantOverrides: VapiRoomData['assistantOverrides'];
  }) => void;
  stopAssistant: () => void;
}

const VapiRecordingContext = createContext<VapiRecordingContextProps | undefined>(undefined);
const VapiRecordingActionsContext = createContext<VapiRecordingActionsContextProps | undefined>(
  undefined
);

interface VapiRecordingProviderProps {
  children: ReactNode;
}

export const VapiRecordingProvider: React.FC<VapiRecordingProviderProps> = ({ children }) => {
  // Tracks the status of the recording (e.g., "idle", "speech-start", "speech-end")
  const [vapiStatus, setVapiStatus] = useState<VapiStatus>('idle');
  // Indicates if the system is ready to start recording
  const [readyRecording, setReadyRecording] = useState<boolean>(false);

  // The current partial not prettified transcript message from the assistant
  const [message, setMessage] = useState<string>('');
  // The final prettified transcript message from the assistant
  const [finalMessage, setFinalMessage] = useState<string>('');
  // Indicates if the assistant has started speaking
  const [firstAssistantSpeech, setFirstAssistantSpeech] = useState<boolean>(false);

  const { setActiveStep } = useVapiRecordingActiveStep();
  const { vapiRoomData } = useVapiStore();

  const startAssistant = useCallback(
    async ({
      selectedAudioDeviceId,
      assistantId,
      assistantOverrides,
    }: {
      selectedAudioDeviceId: string;
      assistantId: VapiRoomData['assistantId'];
      assistantOverrides: VapiRoomData['assistantOverrides'];
    }) => {
      await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedAudioDeviceId ? { exact: selectedAudioDeviceId } : undefined },
      });

      await vapi.setInputDevicesAsync({ audioDeviceId: selectedAudioDeviceId });

      await vapi.start(assistantId, {
        ...assistantOverrides,
        model: assistantOverrides.model as OpenAIModel,
        transcriber: {
          provider: 'deepgram',
          endpointing: 300,
        },
      });
    },
    []
  );

  useEffect(() => {
    if (vapiRoomData?.roomId) {
      const handleSpeechStart = () => {
        console.log('Assistant speech has started.');
        setFirstAssistantSpeech(true);
        setVapiStatus('speech-start');
      };

      const handleSpeechEnd = () => {
        console.log('Assistant speech has ended.');
        setVapiStatus('speech-end');
      };

      const handleCallStart = () => {
        console.log('Call has started.');
        setReadyRecording(true);
      };

      const handleCallEnd = () => {
        console.log('Call has ended.');
        setReadyRecording(false);

        setActiveStep('processing');
      };

      vapi.on('call-start', handleCallStart);

      vapi.on('call-end', handleCallEnd);

      vapi.on('speech-start', handleSpeechStart);

      vapi.on('speech-end', handleSpeechEnd);

      vapi.on('error', (error) => {
        console.log(error);
      });

      vapi.on('message', (msg) => {
        if (msg.type !== 'transcript') return;

        if (msg.transcriptType === 'partial') {
          if (msg.role === 'assistant') {
            setMessage(msg.transcript);
          }
        }

        if (msg.transcriptType === 'final') {
          if (msg.role === 'assistant') {
            setMessage('');
            setFinalMessage(msg.transcript);
          }
        }
      });

      return () => {
        vapi.removeAllListeners();
        vapi.removeListener('speech-start', handleSpeechStart);
        vapi.removeListener('speech-end', handleSpeechEnd);
        vapi.removeListener('call-start', handleCallStart);
        vapi.removeListener('call-end', handleCallEnd);
      };
    }
  }, [setActiveStep, vapiRoomData?.roomId]);

  const stopAssistant = useCallback(() => {
    vapi.stop();
    console.log('Assistant stopped manually.');
  }, []);

  const value = useMemo(
    () => ({
      message,
      readyRecording,
      finalMessage,
      vapiStatus,
      setVapiStatus,
      firstAssistantSpeech,
    }),
    [message, finalMessage, vapiStatus, firstAssistantSpeech, readyRecording]
  );

  const actions = useMemo(
    () => ({ startAssistant, stopAssistant }),
    [startAssistant, stopAssistant]
  );

  return (
    <VapiRecordingContext.Provider value={value}>
      <VapiRecordingActionsContext.Provider value={actions}>
        {children}
      </VapiRecordingActionsContext.Provider>
    </VapiRecordingContext.Provider>
  );
};

export const useVapiRecording = (): VapiRecordingContextProps => {
  const context = useContext(VapiRecordingContext);
  if (!context) {
    throw new Error('useVapiRecording must be used within a VapiRecordingProvider');
  }
  return context;
};

export const useVapiRecordingActions = (): VapiRecordingActionsContextProps => {
  const context = useContext(VapiRecordingActionsContext);
  if (!context) {
    throw new Error('useVapiRecording must be used within a VapiRecordingActionsContext');
  }
  return context;
};
