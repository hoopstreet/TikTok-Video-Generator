import { CalculateMetadataFunction } from "remotion";
import { shortVideoSchema } from "../utils";
import z from "zod";
export declare const calculateMetadata: CalculateMetadataFunction<z.infer<typeof shortVideoSchema>>;
export declare const RemotionRoot: React.FC;
