export enum MusicMoodEnum {
  sad = "sad",
  melancholic = "melancholic",
  happy = "happy",
  euphoric = "euphoric/high",
  excited = "excited",
  chill = "chill",
  uneasy = "uneasy",
  angry = "angry",
  dark = "dark",
  hopeful = "hopeful",
  contemplative = "contemplative",
  funny = "funny/quirky",
}

export enum CaptionPositionEnum {
  top = "top",
  center = "center",
  bottom = "bottom",
}

export enum VoiceEnum {
  fish_ate_budol = "fish_ate_budol",
  fish_kuya_tech = "fish_kuya_tech",
  fish_female_en = "fish_female_en",
  fish_male_en = "fish_male_en",
}

export enum OrientationEnum {
  portrait = "portrait",
  landscape = "landscape",
  square = "square",
}

export enum MusicVolumeEnum {
  low = "low",
  medium = "medium",
  high = "high",
}

export interface SceneInput {
  text: string;
  imageURL?: string;
  negative_prompt?: string;
  searchTerms?: string[];
}

export interface RenderConfig {
  paddingBack: number;
  music: MusicMoodEnum;
  captionPosition: CaptionPositionEnum;
  captionBackgroundColor: string;
  voice: VoiceEnum;
  orientation: OrientationEnum;
  musicVolume: MusicVolumeEnum;
}
