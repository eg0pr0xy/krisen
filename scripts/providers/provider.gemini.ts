import { CrisisManifest, Language } from "../../types";
import { GenerationContext } from "./provider.none";

// Stub provider for future Gemini integration. Does not call any remote service.
export async function generateWithGemini(_ctx: GenerationContext): Promise<CrisisManifest> {
  throw new Error("Gemini provider is not available in offline mode.");
}
