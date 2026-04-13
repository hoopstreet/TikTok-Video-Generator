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
  imageURL: string;
}

const VideoCreator: React.FC = () => {
  const navigate = useNavigate();
  const [scenes, setScenes] = useState<SceneFormData[]>([{ text: "", imageURL: "" }]);
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
  const [voices, setVoices] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("/api/voices");
        // Ensure we always have an array to prevent .map() crashes
        setVoices(Array.isArray(response.data) ? response.data : Object.values(VoiceEnum));
      } catch (err) {
        console.error("Voice fetch failed, using local enums");
        setVoices(Object.values(VoiceEnum));
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleAddScene = () => setScenes([...scenes, { text: "", imageURL: "" }]);
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
      // Structure identical to n8n automation schema
      const payload = {
        scenes: scenes.map((s) => ({
          text: s.text,
          imageURL: s.imageURL,
          searchTerms: [], // Kept for legacy backend compatibility
        })),
        config: {
          ...config,
          voice: config.voice || VoiceEnum.fish_ate_budol,
        }
      };
      const res = await axios.post("/api/short-video", payload);
      navigate(`/video/${res.data.videoId}`);
    } catch (err) {
      setError("Sync Error: Backend unreachable or invalid payload.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Box maxWidth="md" mx="auto" py={4} px={2}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>TikTok Ad Creator</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        {scenes.map((scene, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 3, mb: 3, position: "relative" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" color="textSecondary">Scene {index + 1}</Typography>
              {scenes.length > 1 && (
                <IconButton onClick={() => handleRemoveScene(index)} color="error" size="small"><DeleteIcon /></IconButton>
              )}
            </Box>
            <TextField fullWidth label="Positive Prompt" multiline rows={3} value={scene.text} onChange={(e) => handleSceneChange(index, "text", e.target.value)} required sx={{ mb: 3 }} />
            <TextField fullWidth label="Product Reference (Image URL)" value={scene.imageURL} onChange={(e) => handleSceneChange(index, "imageURL", e.target.value)} required />
          </Paper>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddScene} sx={{ mb: 4 }}>ADD SCENE</Button>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="h5" sx={{ mb: 3 }}>Video Configuration</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField fullWidth label="End Screen Padding (ms)" type="number" value={config.paddingBack} onChange={(e) => handleConfigChange("paddingBack", parseInt(e.target.value))} /></Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth><InputLabel>Music Mood</InputLabel>
              <Select value={config.music} label="Music Mood" onChange={(e) => handleConfigChange("music", e.target.value)}>
                {Object.values(MusicMoodEnum).map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth><InputLabel>Default Voice</InputLabel>
              <Select value={config.voice} label="Default Voice" onChange={(e) => handleConfigChange("voice", e.target.value)}>
                {(voices || []).map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth><InputLabel>Orientation</InputLabel>
              <Select value={config.orientation} label="Orientation" onChange={(e) => handleConfigChange("orientation", e.target.value)}>
                {Object.values(OrientationEnum).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 6, py: 2, fontSize: "1.1rem" }}>
          {loading ? <CircularProgress size={26} color="inherit" /> : "GENERATE AD"}
        </Button>
      </form>
    </Box>
  );
};
export default VideoCreator;
