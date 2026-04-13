import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, TextField, Typography, Paper, Grid, FormControl,
  InputLabel, Select, MenuItem, CircularProgress, Alert, IconButton,
  Divider, InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  SceneInput, RenderConfig, MusicMoodEnum, CaptionPositionEnum,
  VoiceEnum, OrientationEnum, MusicVolumeEnum,
} from "../../types/shorts";

interface SceneFormData {
  text: string;
  negativePrompt: string;
  imageURL: string;
}

const VideoCreator: React.FC = () => {
  const navigate = useNavigate();
  const [scenes, setScenes] = useState<SceneFormData[]>([{ text: "", negativePrompt: "", imageURL: "" }]);
  const [config, setConfig] = useState<RenderConfig>({
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
  const [voices, setVoices] = useState<VoiceEnum[]>([]);
  const [musicTags, setMusicTags] = useState<MusicMoodEnum[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [vResp, mResp] = await Promise.all([
          axios.get("/api/voices"),
          axios.get("/api/music-tags"),
        ]);
        setVoices(vResp.data);
        setMusicTags(mResp.data);
      } catch (err) {
        setError("Failed to load options. Please refresh.");
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleAddScene = () => setScenes([...scenes, { text: "", negativePrompt: "", imageURL: "" }]);
  const handleRemoveScene = (index: number) => {
    if (scenes.length > 1) {
      const ns = [...scenes];
      ns.splice(index, 1);
      setScenes(ns);
    }
  };
  const handleSceneChange = (index: number, field: keyof SceneFormData, value: string) => {
    const ns = [...scenes];
    ns[index] = { ...ns[index], [field]: value };
    setScenes(ns);
  };
  const handleConfigChange = (field: keyof RenderConfig, value: any) => setConfig({ ...config, [field]: value });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const apiScenes: SceneInput[] = scenes.map((s) => ({
        text: s.text,
        negative_prompt: s.negativePrompt,
        imageURL: s.imageURL,
        searchTerms: [],
      }));
      const res = await axios.post("/api/short-video", { scenes: apiScenes, config });
      navigate(`/video/${res.data.videoId}`);
    } catch (err) {
      setError("Failed to create video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Box maxWidth="md" mx="auto" py={4}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>Create New Video</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>Scenes</Typography>
        {scenes.map((scene, index) => (
          <Paper key={index} sx={{ p: 3, mb: 3 }} variant="outlined">
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Scene {index + 1}</Typography>
              {scenes.length > 1 && (
                <IconButton onClick={() => handleRemoveScene(index)} color="error"><DeleteIcon /></IconButton>
              )}
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}><TextField fullWidth label="Text" multiline rows={4} value={scene.text} onChange={(e) => handleSceneChange(index, "text", e.target.value)} required /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Negative Prompt" placeholder="e.g. glitches, color fade, blurry, deformed product" value={scene.negativePrompt} onChange={(e) => handleSceneChange(index, "negativePrompt", e.target.value)} /></Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Product Reference (Image URL)*" value={scene.imageURL} onChange={(e) => handleSceneChange(index, "imageURL", e.target.value)} helperText="Direct link to product image" required />
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Box display="flex" justifyContent="center" mb={4}><Button startIcon={<AddIcon />} onClick={handleAddScene} variant="outlined">Add Scene</Button></Box>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="h5" gutterBottom>Video Configuration</Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="End Screen Padding (ms)" type="number" value={config.paddingBack} onChange={(e) => handleConfigChange("paddingBack", parseInt(e.target.value))} InputProps={{ endAdornment: <InputAdornment position="end">ms</InputAdornment> }} helperText="Duration to keep playing after narration ends" required /></Grid>
            <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Music Mood</InputLabel><Select value={config.music} label="Music Mood" onChange={(e) => handleConfigChange("music", e.target.value)} required>{Object.values(MusicMoodEnum).map((t) => (<MenuItem key={t} value={t}>{t}</MenuItem>))}</Select></FormControl></Grid>
            <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Caption Position</InputLabel><Select value={config.captionPosition} label="Caption Position" onChange={(e) => handleConfigChange("captionPosition", e.target.value)} required>{Object.values(CaptionPositionEnum).map((p) => (<MenuItem key={p} value={p}>{p}</MenuItem>))}</Select></FormControl></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Caption Background Color" value={config.captionBackgroundColor} onChange={(e) => handleConfigChange("captionBackgroundColor", e.target.value)} helperText="Any valid CSS color" required /></Grid>
            <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Default Voice</InputLabel><Select value={config.voice} label="Default Voice" onChange={(e) => handleConfigChange("voice", e.target.value)} required>{Object.values(VoiceEnum).map((v) => (<MenuItem key={v} value={v}>{v}</MenuItem>))}</Select></FormControl></Grid>
            <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Orientation</InputLabel><Select value={config.orientation} label="Orientation" onChange={(e) => handleConfigChange("orientation", e.target.value)} required>{Object.values(OrientationEnum).map((o) => (<MenuItem key={o} value={o}>{o}</MenuItem>))}</Select></FormControl></Grid>
            <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Volume of the background audio</InputLabel><Select value={config.musicVolume} label="Volume of the background audio" onChange={(e) => handleConfigChange("musicVolume", e.target.value)} required>{Object.values(MusicVolumeEnum).map((v) => (<MenuItem key={v} value={v}>{v}</MenuItem>))}</Select></FormControl></Grid>
          </Grid>
        </Paper>
        <Box display="flex" justifyContent="center">
          <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 200 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "CREATE VIDEO"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
export default VideoCreator;
// Build Update: Monday Apr 13 19:48:00 UTC 2026
