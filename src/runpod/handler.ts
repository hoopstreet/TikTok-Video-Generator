export const runpodHandler = async (event: any) => {
  const { input } = event;
  console.log("🎬 Received video request:", input);
  
  // Your existing generation logic goes here
  // Return the final video URL or object
  return { status: "success", message: "Video generated" };
};
