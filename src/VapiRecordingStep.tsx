import { Box, Button } from '@mui/material';
import { useCallback } from 'react';
import { useVapiRecordingActions } from './VapiRecordingProvider';
import { useVapiRecordingActiveStep } from './VapiRecordingActiveStepProvider';

export const VapiRecordingStep = () => {
  const { stopAssistant } = useVapiRecordingActions();
  const { setActiveStep } = useVapiRecordingActiveStep();

  const handleStopRecording = useCallback(() => {
    stopAssistant();
    setActiveStep('processing');
  }, [stopAssistant]);

  return (
    <>
      <Box component="div" display="flex" justifyContent="center" alignItems="center">
        RECORDING...
      </Box>
      <Button
        onClick={handleStopRecording}
        variant="contained"
        color="error"
        sx={{ margin: '24px auto 8px', display: 'flex' }}
      >
        END CALL
      </Button>
    </>
  );
};
