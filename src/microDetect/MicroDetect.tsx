/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { DeviceSelect } from './DeviceSelect';

export const MicroDetect = ({
  selectedAudioDeviceId,
  setSelectedAudioDeviceId,
}: {
  selectedAudioDeviceId: string;
  setSelectedAudioDeviceId: (value: string) => void;
}) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);

  // Function to fetch and update the list of available audio input devices
  const updateDeviceList = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter((device) => device.kind === 'audioinput');

      setDeviceList(audioInputs);
      if (!selectedAudioDeviceId && audioInputs.length > 0) {
        setSelectedAudioDeviceId(audioInputs[0].deviceId);
      }
    } catch (error) {
      setErrorMessage('Could not fetch audio devices');
    }
  };

  // Initialize and update devices on mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop()); // Stop using the default device
        updateDeviceList();
        navigator.mediaDevices.addEventListener('devicechange', updateDeviceList);
      })
      .catch(() => {
        setErrorMessage('Access to microphone is denied');
      });

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateDeviceList);
    };
  }, []);

  // Setup microphone when selectedDevice changes
  useEffect(() => {
    async function setupMicrophone() {
      if (!selectedAudioDeviceId) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: selectedAudioDeviceId ? { exact: selectedAudioDeviceId } : undefined },
        });

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const microphone = { source, analyser, stream };
        return microphone;
      } catch (error) {
        setErrorMessage('Error accessing microphone');
        return null;
      }
    }

    let microphone:
      | { source: MediaStreamAudioSourceNode; analyser: AnalyserNode; stream: MediaStream }
      | null
      | undefined;
    let volumeCheckInterval: string | number | NodeJS.Timeout | undefined;

    setupMicrophone().then((newMic) => {
      microphone = newMic;

      volumeCheckInterval = setInterval(() => {
        if (!microphone) return;

        const { analyser } = microphone;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const maxVolume = dataArray.reduce((acc, val) => Math.max(acc, val), 0);
        setAudioLevel(maxVolume);
        setIsMuted(maxVolume < 10);
      }, 100);
    });

    return () => {
      clearInterval(volumeCheckInterval);
      microphone?.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    };
  }, [selectedAudioDeviceId]);

  const renderVolumeBars = () => {
    const bars = [];
    const totalBars = 12;
    const litBars = Math.floor((audioLevel / 255) * totalBars);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < totalBars; i++) {
      bars.push(
        <div
          key={i}
          style={{
            height: '20px',
            width: '14px',
            marginRight: '6px',
            borderRadius: '3px',
            backgroundColor: i < litBars ? '#625FFF' : '#E9EDF1',
          }}
        />
      );
    }
    return <div style={{ display: 'flex', justifyContent: 'center' }}>{bars}</div>;
  };

  if (!deviceList.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        Permission to the microphone is rejected!
      </Box>
    );
  }

  return (
    <Box component="div" width="fit-content" margin="16px auto 0">
      <DeviceSelect
        selectedDevice={selectedAudioDeviceId}
        setSelectedDevice={setSelectedAudioDeviceId}
        deviceList={deviceList}
      />

      <Box component="div" display="flex" alignItems="flex-start" justifyContent="end">
        <Box component="div" alignItems="center" display="flex">
          <Typography variant="body2" color="grey.700" mr={4.2}>
            Input Level:
          </Typography>
        </Box>
        <Box component="div" mb={!isMuted && !errorMessage ? 8 : 0}>
          {renderVolumeBars()}

          {isMuted && (
            <Typography variant="body2" color="error.main" mt={3}>
              It seems your microphone is muted.
            </Typography>
          )}
          {errorMessage && (
            <Typography variant="body2" color="error.main" mt={3}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
