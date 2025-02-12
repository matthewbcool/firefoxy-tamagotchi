export interface XRProps {
  enterAR: () => void;
  enterVR: () => void;
}

export interface AIEngineConfig {
  taskName: string;
}

export interface InferenceResult {
  summary_text: string;
}

export interface ProgressData {
  progress: number;
  status: string;
}
