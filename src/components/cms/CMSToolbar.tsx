import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { AppBar, Toolbar, Typography, Button, Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface CMSToolbarProps {
  onSave: () => void;
  isDirty: boolean;
  isSaving?: boolean;
}

const CMSToolbar: React.FC<CMSToolbarProps> = ({ onSave, isDirty, isSaving = false }) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        bgcolor: "warning.main",
        color: "warning.contrastText",
      }}
    >
      <Toolbar>
        <EditIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Edit Mode
        </Typography>

        {isDirty && <Chip label="Unsaved changes" color="error" size="small" sx={{ mr: 2 }} />}

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            onClick={onSave}
            disabled={isSaving}
            sx={{ color: "white" }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={() => navigate("/admin/cms")}
            sx={{ borderColor: "white", color: "white", "&:hover": { borderColor: "white" } }}
          >
            Close
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CMSToolbar;
