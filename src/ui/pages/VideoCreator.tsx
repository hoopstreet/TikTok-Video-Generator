import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem, CircularProgress, IconButton, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { MusicMoodEnum, CaptionPositionEnum, VoiceEnum, OrientationEnum, MusicVolumeEnum } from "../../types/shorts";
interface SceneFormData { text: string; imageURL: string; }
const VideoCreator: React.FC = () => {
  const navigate = useNavigate();
  const [scenes, setScenes] = useState<SceneFormData[]>([{ text: "", imageURL: "" }]);
  const [config, setConfig] = useState({ paddingBack: 1500, music: MusicMoodEnum.excited, captionPosition: CaptionPositionEnum.center, captionBackgroundColor: "transparent", voice: VoiceEnum.fish_ate_budol, orientation: OrientationEnum.portrait, musicVolume: MusicVolumeEnum.low });
  const [loading, setLoading] = useState(false);
  const handleAddScene = () => setScenes([...scenes, { text: "", imageURL: "" }]);
  const handleRemoveScene = (index: number) => { if(scenes.length > 1) { const ns = [...scenes]; ns.splice(index, 1); setScenes(ns); } };
  const handleSceneChange = (index: number, field: keyof SceneFormData, value: string) => { const ns = [...scenes]; ns[index] = { ...ns[index], [field]: value }; setScenes(ns); };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiScenes = scenes.map(s => ({ text: s.text, imageURL: s.imageURL, searchTerms: [] }));
      const res = await axios.post("/api/short-video", { scenes: apiScenes, config });
      navigate(`/video/${res.data.videoId}`);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  return (
    <Box maxWidth="md" mx="auto" py={4} px={2}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>TikTok Ad Creator</Typography>
      <form onSubmit={handleSubmit}>
        {scenes.map((scene, index) => (
          <Paper key={index} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between"><Typography>Scene {index + 1}</Typography>
            <IconButton onClick={() => handleRemoveScene(index)} color="error"><DeleteIcon /></IconButton></Box>
            <TextField fullWidth label="Positive Prompt" multiline rows={3} value={scene.text} onChange={(e) => handleSceneChange(index, "text", e.target.value)} sx={{mb:2}} />
            <TextField fullWidth label="Product Reference (Image URL)" value={scene.imageURL} onChange={(e) => handleSceneChange(index, "imageURL", e.target.value)} />
          </Paper>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddScene}>ADD SCENE</Button>
        <Divider sx={{ my: 4 }} />
        <Button type="submit" variant="contained" fullWidth disabled={loading}>{loading ? <CircularProgress size={24} /> : "GENERATE AD"}</Button>
      </form>
    </Box>
  );
};
export default VideoCreator;
