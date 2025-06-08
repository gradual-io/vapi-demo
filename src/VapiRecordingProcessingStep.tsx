import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const VapiRecordingProcessingStep = () => {
  const [message, setMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`https://stage.pitchmonster.io/demo/vapi/subscribe/1`);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log('📡 Отримано подію:', parsed);
        setMessage(parsed.message);
      } catch (err) {
        console.error('❌ Помилка при розборі події:', err);
        setError('Error parsing event data');
      }
    };

    eventSource.onerror = (err) => {
      console.error('❌ Помилка SSE:', err);
      setError('Connection error occurred');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Processing Call Data
      </Typography>

      {!message && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Waiting for data...</Typography>
        </Box>
      )}

      {message && (
        <Box sx={{ mt: 4, textAlign: 'left' }}>
          <Typography variant="h6">📞 Call ID:</Typography>
          <Typography sx={{ mb: 2 }}>{message.call?.id ?? '—'}</Typography>

          {message.recordingUrl ? (
            <>
              <Typography variant="h6">🎧 Audio:</Typography>
              <audio controls src={message.recordingUrl} style={{ width: '100%' }} />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No audio available.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
