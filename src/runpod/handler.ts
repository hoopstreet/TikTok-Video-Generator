import { handler as realHandler } from './real_logic'; // adjust path if needed

export const handler = async (event: any) => {
  console.log("📥 JOB RECEIVED:", JSON.stringify(event, null, 2));
  try {
    const result = await realHandler(event);
    console.log("✅ JOB SUCCESS:", result);
    return result;
  } catch (err: any) {
    console.error("❌ JOB FAILED:", err.message);
    return { error: err.message };
  }
};
