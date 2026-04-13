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
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  return (
    <Box maxWidth="md" mx="auto" py={4} px={2}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>TikTok Ad Creator</Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>Scenes</Typography>
        {scenes.map((scene, index) => (
          <Paper key={index} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Scene {index + 1}</Typography>
              {scenes.length > 1 && (
                <IconButton onClick={() => handleRemoveScene(index)} color="error"><DeleteIcon /></IconButton>
              )}
            </Box>
            <TextField fullWidth label="Text" multiline rows={3} value={scene.text} onChange={(e) => handleSceneChange(index, "text", e.target.value)} sx={{mb:2}} required />
            <TextField fullWidth label="Product Reference (Image URL)" value={scene.imageURL} onChange={(e) => handleSceneChange(index, "imageURL", e.target.value)} helperText="Direct link to product image" required />
          </Paper>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddScene} variant="text" sx={{ mb: 4 }}>ADD SCENE</Button>
        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}><TextField fullWidth type="number" label="End Screen Padding (ms)" value={config.paddingBack} onChange={(e) => setConfig({ ...config, paddingBack: parseInt(e.target.value) })} helperText="Duration to keep playing after narration ends" /></Grid>
          <Grid item xs={12}><FormControl fullWidth><InputLabel>Music Mood</InputLabel><Select value={config.music} label="Music Mood" onChange={(e) => setConfig({ ...config, music: e.target.value as any })}><MenuItem value="excited">excited</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12}><FormControl fullWidth><InputLabel>Caption Position</InputLabel><Select value={config.captionPosition} label="Caption Position" onChange={(e) => setConfig({ ...config, captionPosition: e.target.value as any })}><MenuItem value="center">center</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12}><TextField fullWidth label="Caption Background Color" value={config.captionBackgroundColor} onChange={(e) => setConfig({ ...config, captionBackgroundColor: e.target.value })} helperText="Any valid CSS color (name, hex, rgba)" /></Grid>
          <Grid item xs={12}><FormControl fullWidth><InputLabel>Default Voice</InputLabel><Select value={config.voice} label="Default Voice" onChange={(e) => setConfig({ ...config, voice: e.target.value as any })}><MenuItem value="fish_ate_budol">fish_ate_budol</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12}><FormControl fullWidth><InputLabel>Orientation</InputLabel><Select value={config.orientation} label="Orientation" onChange={(e) => setConfig({ ...config, orientation: e.target.value as any })}><MenuItem value="portrait">portrait</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12}><FormControl fullWidth><InputLabel>Volume of the background audio</InputLabel><Select value={config.musicVolume} label="Volume of the background audio" onChange={(e) => setConfig({ ...config, musicVolume: e.target.value as any })}><MenuItem value="low">low</MenuItem></Select></FormControl></Grid>
        </Grid>
        <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>{loading ? <CircularProgress size={24} /> : "GENERATE AD"}</Button>
      </form>
    </Box>
  );
};
export default VideoCreator;
