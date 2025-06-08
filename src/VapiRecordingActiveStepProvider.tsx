import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

type Step = 'settings' | 'recording' | 'processing';

const RecordingStepContext = createContext(
  {} as {
    activeStep: Step;
    setActiveStep: (value: Step) => void;
  }
);

export const VapiRecordingStepProvider = ({ children }: { children: ReactNode }) => {
  const [activeStep, setActiveStep] = useState<Step>(() => {
    return 'settings';
  });

  const value = useMemo(() => ({ activeStep, setActiveStep }), [activeStep]);

  return <RecordingStepContext.Provider value={value}>{children}</RecordingStepContext.Provider>;
};

export const useVapiRecordingActiveStep = () => {
  return useContext(RecordingStepContext);
};
