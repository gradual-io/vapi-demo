import {
  useVapiRecordingActiveStep,
  VapiRecordingStepProvider,
} from './VapiRecordingActiveStepProvider';
import { VapiRecordingProcessingStep } from './VapiRecordingProcessingStep';
import { VapiRecordingProvider } from './VapiRecordingProvider';
import { VapiRecordingSettingsStep } from './VapiRecordingSettingsStep';
import { VapiRecordingStep } from './VapiRecordingStep';

function App() {
  const VapiRecordingActiveStep = () => {
    const { activeStep } = useVapiRecordingActiveStep();

    switch (activeStep) {
      case 'settings':
        return <VapiRecordingSettingsStep />;
      case 'recording':
        return <VapiRecordingStep />;
      case 'processing':
        return <VapiRecordingProcessingStep />;
      default:
        return null;
    }
  };

  return (
    <VapiRecordingStepProvider>
      <VapiRecordingProvider>
        <VapiRecordingActiveStep />
      </VapiRecordingProvider>
    </VapiRecordingStepProvider>
  );
}

export default App;
