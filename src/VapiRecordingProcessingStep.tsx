import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const VapiRecordingProcessingStep = () => {
  const [message, setMessage] = useState<any>(null);
  useEffect(() => {
    const eventSource = new EventSource('https://stage.pitchmonster.io/demo/vapi/subscribe/1');

    const handleRecordingCompleted = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        console.log('Received event:', data);

        const { message } = data;

        if (message) {
          setMessage(message);
        }
      } catch (error) {
        console.error('Error parsing event data:', error);
      }
    };

    eventSource.addEventListener('recording-completed', handleRecordingCompleted);

    return () => {
      eventSource.removeEventListener('recording-completed', handleRecordingCompleted);
      eventSource.close();
    };
  }, []);

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Processing Call Data
      </Typography>

      {message?.recordingUrl ? (
        <Box sx={{ mt: 4, textAlign: 'left' }}>
          <Typography variant="h6">📞 Call ID:</Typography>
          <Typography sx={{ mb: 2 }}>{message.call?.id ?? '—'}</Typography>

          <Typography variant="h6">🎧 Audio:</Typography>
          <audio controls src={message.recordingUrl} style={{ width: '100%' }} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Waiting for data...</Typography>
        </Box>
      )}
    </Box>
  );
};
