/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */

import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';

export const DeviceSelect = ({
  selectedDevice,
  setSelectedDevice,
  deviceList,
}: {
  selectedDevice: string;
  setSelectedDevice: (value: string) => void;
  deviceList: any[];
}) => {
  return (
    <Box
      component="div"
      display="flex"
      alignItems="baseline"
      flexDirection="row"
      mb={4}
      width="fit-content"
    >
      <Box component="div" display="flex" alignItems="center" mb={4}>
        <Typography variant="body2" color="grey.700" mr={4.2} display="block" whiteSpace="nowrap">
          Choose your microphone
        </Typography>
      </Box>
      <FormControl fullWidth>
        <Select
          disabled={deviceList.length === 0}
          id="device-select"
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          sx={{
            width: 236,
            background: 'white',
            borderRadius: 1,
            '& .MuiSvgIcon-root': {
              // Styling for the icon
              fontSize: '1.5rem', // Adjust size as needed
            },
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 222, // Adjust height as necessary
                width: 236, // Adjust width to fit content or container
              },
            },
          }}
        >
          {deviceList.map((device, index) => (
            <MenuItem
              key={index}
              value={device.deviceId}
              sx={{
                width: '100%', // Ensure full width usage
              }}
            >
              <div
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  width: '100%', // Ensure the div uses up all available space
                }}
              >
                {device.label || `Microphone ${index + 1}`}
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
