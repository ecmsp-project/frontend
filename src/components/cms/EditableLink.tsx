import React, { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { Box, TextField, Popover, Button } from "@mui/material";

interface EditableLinkProps {
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  label: string;
  isEditMode: boolean;
}

const EditableLink: React.FC<EditableLinkProps> = ({
  value,
  onChange,
  icon,
  label,
  isEditMode,
}) => {
  const [editValue, setEditValue] = useState(value);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!isEditMode) return;
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleSave = () => {
    onChange(editValue);
    setAnchorEl(null);
  };

  const handleCancel = () => {
    setEditValue(value);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          cursor: isEditMode ? "pointer" : "default",
          position: "relative",
          display: "inline-flex",
          "&:hover": isEditMode
            ? {
                outline: "2px dashed",
                outlineColor: "primary.main",
                outlineOffset: "4px",
                "& .edit-icon": {
                  opacity: 1,
                },
              }
            : {},
          transition: "all 0.2s",
        }}
      >
        {icon}
        {isEditMode && (
          <EditIcon
            className="edit-icon"
            sx={{
              position: "absolute",
              top: -4,
              right: -4,
              fontSize: 16,
              color: "primary.main",
              opacity: 0,
              transition: "opacity 0.2s",
              bgcolor: "white",
              borderRadius: "50%",
              padding: "2px",
            }}
          />
        )}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCancel}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2, minWidth: 350 }}>
          <Box sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>{label}</Box>

          <TextField
            fullWidth
            size="small"
            label="URL"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="https://..."
            autoFocus
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<CloseIcon />}
              size="small"
            >
              Anuluj
            </Button>
            <Button variant="contained" onClick={handleSave} startIcon={<CheckIcon />} size="small">
              Zapisz
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default EditableLink;
