interface TLRequest {
    /** Purpose of the TrimLoop request */
    action: 'TOGGLE_LOOP' | 'UPDATE_LOOP_BOUND' | 'CHECK_LOOP_BOUND' | 'PING' | 'SAVE';
    /** Data necessary to perform request */
    details?: { [key: string]: any };
}

interface UpdateLoopBoundDetails {
    /** Pin to current video timestamp, set to provided value, or reset to defaults (0 for start, video.duration for end) */
    mode: 'pin' | 'set' | 'reset';
    lb?: LoopBound;
}

/** The boundary of the loop segment. Each value is a side. */
interface LoopBound {
    start?: number;
    end?: number;
}

interface ContentData {
    lb: Required<LoopBound>;
    loopId: number | null;
}