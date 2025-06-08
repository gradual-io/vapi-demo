import { useEffect, useState } from 'react';

import { Box, Button } from '@mui/material';

import { MicroDetect } from './microDetect/MicroDetect';
import { useVapiStore } from './useVapiStore';
import { useVapiRecordingActiveStep } from './VapiRecordingActiveStepProvider';
import { useVapiRecording, useVapiRecordingActions } from './VapiRecordingProvider';

export const VapiRecordingSettingsStep = () => {
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>('');

  // Vapi
  const { startAssistant } = useVapiRecordingActions();
  const { setActiveStep } = useVapiRecordingActiveStep();
  const { setVapiRoomData } = useVapiStore();
  const { setVapiStatus, vapiStatus } = useVapiRecording();

  const handleStartRecording = async () => {
    const vapiRoomData = {
      assistantId: 'ca066247-5c8b-4686-8cf5-475acc15e15e',
      assistantOverrides: {
        serverUrl: 'https://stage.pitchmonster.io/vapi/callback/demo/1',
        model: {
          provider: 'openai',
          temperature: 0.3,
          maxTokens: 250,
          model: 'gpt-4.1-mini-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'This is a cold call to you.',
            },
          ],
        },
        firstMessage: 'Hey, Rick speaking',
      },
    } as any;

    setVapiRoomData(vapiRoomData);
    startAssistant({
      selectedAudioDeviceId,
      assistantId: vapiRoomData.assistantId,
      assistantOverrides: vapiRoomData.assistantOverrides,
    });
    setActiveStep('recording');
  };

  useEffect(() => {
    if (vapiStatus !== 'idle') {
      setVapiStatus('idle');
    }
  }, [setVapiStatus, vapiStatus]);

  return (
    <>
      <Box
        component="div"
        sx={{
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
          px: 10,
          pt: 16,
        }}
      >
        <MicroDetect
          selectedAudioDeviceId={selectedAudioDeviceId}
          setSelectedAudioDeviceId={setSelectedAudioDeviceId}
        />
        <Box component="div" pb={20}>
          <Button
            size="large"
            variant="contained"
            onClick={handleStartRecording}
            sx={{ margin: '24px auto 8px', display: 'flex' }}
            disabled={!selectedAudioDeviceId}
          >
            Start recording
          </Button>
        </Box>
      </Box>
    </>
  );
};
