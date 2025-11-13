import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { IconButton, Tooltip } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type { CategoryEdgeData } from "../../../types/category";

const CategoryEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}) => {
  const edgeData = data as CategoryEdgeData | undefined;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isHovered ? "#1976d2" : "#b0b0b0",
          strokeWidth: isHovered ? 3 : 2,
          cursor: "pointer",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {isHovered && edgeData?.onAddBetween && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
          >
            <Tooltip title="Dodaj kategorię między węzłami" arrow>
              <IconButton
                size="small"
                color="primary"
                onClick={edgeData.onAddBetween}
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: 2,
                  "&:hover": {
                    bgcolor: "primary.light",
                    color: "white",
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CategoryEdge;
