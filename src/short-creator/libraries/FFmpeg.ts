import { logger } from "../../logger";
import { FFMpeg as FFMpegAPI } from "../types/shorts";

export class FFMpeg implements FFMpegAPI {
  private logger = logger.child({ module: "FFMpeg" });
  private ffmpegPath: string = "ffmpeg";

  constructor() {
    this.logger.info("FFmpeg path set to:" as any, this.ffmpegPath as any);
  }
}
