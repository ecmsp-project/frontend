import React, { useState, useRef, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import {
  Box,
  TextField,
  Popover,
  ButtonGroup,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2";
  isEditMode: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  multiline = false,
  isEditMode,
}) => {
  const [editValue, setEditValue] = useState(value);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [fontSize, setFontSize] = useState("16");
  const [fontWeight, setFontWeight] = useState("400");
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!isEditMode) return;
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
        ref={textRef}
        onClick={handleClick}
        sx={{
          cursor: isEditMode ? "pointer" : "default",
          position: "relative",
          "&:hover": isEditMode
            ? {
                outline: "2px dashed",
                outlineColor: "primary.main",
                outlineOffset: "4px",
              }
            : {},
          transition: "all 0.2s",
        }}
      >
        {editValue}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCancel}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, minWidth: 400 }}>
          <TextField
            fullWidth
            multiline={multiline}
            rows={multiline ? 3 : 1}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            variant="outlined"
            autoFocus
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rozmiar</InputLabel>
              <Select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                label="Rozmiar"
              >
                <MenuItem value="12">12px</MenuItem>
                <MenuItem value="14">14px</MenuItem>
                <MenuItem value="16">16px</MenuItem>
                <MenuItem value="18">18px</MenuItem>
                <MenuItem value="20">20px</MenuItem>
                <MenuItem value="24">24px</MenuItem>
                <MenuItem value="32">32px</MenuItem>
                <MenuItem value="48">48px</MenuItem>
              </Select>
            </FormControl>

            <ButtonGroup size="small">
              <Button
                variant={fontWeight === "700" ? "contained" : "outlined"}
                onClick={() => setFontWeight(fontWeight === "700" ? "400" : "700")}
              >
                <FormatBoldIcon />
              </Button>
            </ButtonGroup>
          </Box>

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

export default EditableText;
