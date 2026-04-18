// Body-map shared types — vendored from react-muscle-highlighter for our own
// future custom physio body-map package. The package is still installed and
// used at runtime; this file exists so our local data files (bodyFront,
// bodyBack, bodyFemaleFront, bodyFemaleBack) compile against types we control.
//
// See ./LICENSE for attribution.

export type Slug =
  | 'abs'
  | 'adductors'
  | 'ankles'
  | 'biceps'
  | 'calves'
  | 'chest'
  | 'deltoids'
  | 'feet'
  | 'forearm'
  | 'gluteal'
  | 'hamstring'
  | 'hands'
  | 'hair'
  | 'head'
  | 'knees'
  | 'lower-back'
  | 'neck'
  | 'obliques'
  | 'quadriceps'
  | 'tibialis'
  | 'trapezius'
  | 'triceps'
  | 'upper-back';

export interface BodyPartStyles {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface BodyPart {
  color?: string;
  slug?: Slug;
  path?: {
    common?: string[];
    left?: string[];
    right?: string[];
  };
}

export interface ExtendedBodyPart extends BodyPart {
  color?: string;
  intensity?: number;
  side?: 'left' | 'right';
  styles?: BodyPartStyles;
}
