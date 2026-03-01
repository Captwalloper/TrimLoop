interface TLRequest {
    action: 'TOGGLE_LOOP' | 'UPDATE_LOOP_BOUND' | 'CHECK_LOOP_BOUND';
    details?: { [key: string]: any };
}

interface UpdateLoopBoundDetails {
  mode: 'pin' | 'set' | 'reset';
  lb?: {
      start?: number;
      end?: number;
  };
}