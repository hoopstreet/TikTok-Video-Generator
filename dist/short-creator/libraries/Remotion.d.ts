import z from "zod";
import { Config } from "../../config";
import { shortVideoSchema } from "../../components/utils";
import { OrientationEnum } from "../../types/shorts";
export declare class Remotion {
    private bundled;
    private config;
    constructor(bundled: string, config: Config);
    static init(config: Config): Promise<Remotion>;
    render(data: z.infer<typeof shortVideoSchema>, id: string, orientation: OrientationEnum): Promise<void>;
    testRender(outputLocation: string): Promise<void>;
}
