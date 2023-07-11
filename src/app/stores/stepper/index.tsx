/* eslint-disable react/function-component-definition */
import React, { createContext, useReducer, useContext, Dispatch, useMemo } from 'react';

interface StepperState {
  currentActiveIndex: number;
}

interface StepperAction {
  type: 'NEXT_STEP' | 'PREV_STEP'| 'HOME';
}

type StepperDispatch = Dispatch<StepperAction>;

const initialState: StepperState = {
  currentActiveIndex: 0,
};

const stepperReducer = (state: StepperState, action: StepperAction): StepperState => {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentActiveIndex: state.currentActiveIndex + 1,
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentActiveIndex: state.currentActiveIndex - 1,
      };
    case 'HOME':
      return {
        ...state,
        currentActiveIndex: 0,
      };
    default:
      return state;
  }
};

const StepperContext = createContext<{ state: StepperState; dispatchStep: StepperDispatch } | null>(
  null,
);

const StepperProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatchStep] = useReducer(stepperReducer, initialState);
  const value = useMemo(() => ({ state, dispatchStep }), [state]);
  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>;
};

const useStepperContext = () => {
  const context = useContext(StepperContext);
  if (context === null) {
    throw new Error('useStepperContext must be used within a StepperProvider');
  }
  return context;
};

export { StepperContext, StepperProvider, useStepperContext };