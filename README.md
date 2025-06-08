# VAPI Demo Project

This project demonstrates integration with VAPI for handling voice calls and processing.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd vapi-demo
```

2. Install dependencies:

```bash
npm install
# or if you use yarn
yarn install
```

## Running the Application

1. Start the development server:

```bash
npm run dev
# or if you use yarn
yarn dev
```

2. Open your browser and navigate to the local URL shown in the terminal (typically `http://localhost:5173`)

## Building for Production

To build the application for production:

```bash
npm run build
# or if you use yarn
yarn build
```

To preview the production build:

```bash
npm run preview
# or if you use yarn
yarn preview
```

## Using the Application

1. **Initial Setup**

   - When you first open the application, you'll be prompted to select your microphone
   - Choose your preferred audio input device from the dropdown menu

2. **Starting a Call**

   - Click the "Start recording" button to begin a new call
   - Make sure your microphone is not muted (you can check the input level indicator)

3. **During the Call**

   - You'll see a "RECORDING..." indicator while the call is active
   - The assistant will respond to your voice input

4. **Ending the Call**
   - Click the "END CALL" button to finish the call
   - You'll be automatically redirected to the processing screen
   - Wait for the call data to be processed and displayed

## Troubleshooting

- If you see a "Permission to the microphone is rejected!" message, make sure to grant microphone access in your browser
- If the connection error occurs during processing, check your internet connection and try again
- Make sure your microphone is not muted and the input level is showing activity

## Technical Details

The application uses:

- React 19
- Vite as the build tool
- Material-UI for components
- VAPI AI (@vapi-ai/web) for voice processing
- Server-Sent Events (SSE) for real-time updates
- TypeScript for type safety

## Development

The project includes several development tools:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for static type checking

To lint the code:

```bash
npm run lint
# or if you use yarn
yarn lint
```

## Support

For any issues or questions, please contact the development team or create an issue in the repository.
