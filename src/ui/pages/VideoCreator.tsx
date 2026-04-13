import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Box, Button, TextField, Typography, Paper, Grid, 
  FormControl, InputLabel, Select, MenuItem, CircularProgress, 
  Alert, IconButton, Divider 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { MusicMoodEnum, CaptionPositionEnum, VoiceEnum, OrientationEnum, MusicVolumeEnum } from "../../types/shorts";

interface SceneFormData {
  text: string;
  imageURL: string;
}

const VideoCreator: React.FC = () => {
  const navigate = useNavigate();
  const [scenes, setScenes] = useState<SceneFormData[]>([{ text: "", imageURL: "" }]);
  const [config, setConfig] = useState({
    paddingBack: 1500,
    music: MusicMoodEnum.excited,
    captionPosition: CaptionPositionEnum.center,
    captionBackgroundColor: "transparent",
    voice: VoiceEnum.fish_ate_budol,
    orientation: OrientationEnum.portrait,
    musicVolume: MusicVolumeEnum.low,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddScene = () => setScenes([...scenes, { text: "", imageURL: "" }]);
  const handleRemoveScene = (index: number) => { if(scenes.length > 1) { const ns = [...scenes]; ns.splice(index, 1); setScenes(ns); } };
  const handleSceneChange = (index: number, field: keyof SceneFormData, value: string) => {
    const ns = [...scenes]; ns[index] = { ...ns[index], [field]: value }; setScenes(ns);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiScenes = scenes.map(s => ({ text: s.text, imageURL: s.imageURL, searchTerms: [] }));
      const res = await axios.post("/api/short-video", { scenes: apiScenes, config });
      navigate(`/video/${res.data.videoId}`);
    } catch (err) { setError("Failed to create ad."); } finally { setLoading(false); }
  };

  return (
    <Box maxWidth="md" mx="auto" py={4}>
      <Typography variant="h4" gutterBottom>TikTok Ad Creator (Image Reference)</Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>Scenes</Typography>
        {scenes.map((scene, index) => (
          <Paper key={index} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Scene {index + 1}</Typography>
              <IconButton onClick={() => handleRemoveScene(index)} color="error"><DeleteIcon /></IconButton>
            </Box>
            <TextField fullWidth label="Positive Prompt" multiline rows={3} value={scene.text} onChange={(e) => handleSceneChange(index, "text", e.target.value)} sx={{mb:2}} required />
            <TextField fullWidth label="Product Reference (Image URL)" value={scene.imageURL} onChange={(e) => handleSceneChange(index, "imageURL", e.target.value)} helperText="Direct link to product image" required />
          </Paper>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddScene} sx={{mb:4}}>Add Scene</Button>
        <Divider sx={{mb:4}} />
        <Button type="submit" variant="contained" fullWidth disabled={loading}>{loading ? <CircularProgress size={24}/> : "Generate Ad"}</Button>
      </form>
    </Box>
  );
};
export default VideoCreator;
