import React, { createContext, useContext, useState } from 'react';

export type DemoScenario = 'scenario1' | 'scenario2' | 'scenario3' | 'scenario4';

interface DemoModeContextType {
  isDemoMode: boolean;
  activeScenario: DemoScenario | null;
  toggleDemoMode: (enabled?: boolean) => void;
  triggerScenario: (scenario: DemoScenario) => void;
  clearScenario: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);

  const toggleDemoMode = (enabled?: boolean) => {
    const nextState = enabled !== undefined ? enabled : !isDemoMode;
    setIsDemoMode(nextState);
    if (!nextState) setActiveScenario(null);
  };

  const triggerScenario = (scenario: DemoScenario) => {
    setIsDemoMode(true);
    setActiveScenario(scenario);
  };

  const clearScenario = () => {
    setActiveScenario(null);
  };

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        activeScenario,
        toggleDemoMode,
        triggerScenario,
        clearScenario,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = (): DemoModeContextType => {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};
