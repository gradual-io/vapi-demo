/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const VapiRecordingProcessingStep = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`https://stage.pitchmonster.io/demo/vapi/subscribe/1`);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log('📡 Отримано подію:', parsed);
        setData(parsed);
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

      {!data && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Waiting for data...</Typography>
        </Box>
      )}

      {data && (
        <Box sx={{ mt: 4, textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>
            🔔 Received Data:
          </Typography>
          <Box
            sx={{
              bgcolor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
              maxHeight: '400px',
              overflow: 'auto',
            }}
          >
            <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>
          </Box>
        </Box>
      )}
    </Box>
  );
};
