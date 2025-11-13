import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { IconButton } from "@mui/material";
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('CategoryEdge: Button clicked!', id);
    console.log('CategoryEdge: edgeData:', edgeData);
    console.log('CategoryEdge: hasCallback:', !!edgeData?.onAddBetween);

    if (edgeData?.onAddBetween) {
      console.log('CategoryEdge: Calling onAddBetween...');
      edgeData.onAddBetween();
    } else {
      console.error('CategoryEdge: No onAddBetween callback found!');
    }
  };

  React.useEffect(() => {
    console.log('CategoryEdge mounted:', { id, hasData: !!edgeData, hasCallback: !!edgeData?.onAddBetween });
  }, [id, edgeData]);

  return (
    <>
      {/* Invisible wider path for better hover detection */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={30}
        style={{ cursor: "pointer" }}
        onMouseEnter={() => {
          console.log('CategoryEdge: Mouse entered edge', id);
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          console.log('CategoryEdge: Mouse left edge', id);
          setIsHovered(false);
        }}
      />

      {/* Visible edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isHovered ? "#1976d2" : "#b0b0b0",
          strokeWidth: isHovered ? 3 : 2,
          pointerEvents: "none",
        }}
      />

      {isHovered && edgeData?.onAddBetween && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
              zIndex: 10000,
            }}
            onMouseEnter={() => {
              console.log('CategoryEdge: Mouse entered button area', id);
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              console.log('CategoryEdge: Mouse left button area', id);
            }}
          >
            <IconButton
              size="small"
              color="primary"
              onClick={handleClick}
              onMouseDown={(e) => {
                console.log('CategoryEdge: Mouse down on button', id);
                e.stopPropagation();
              }}
              title="Dodaj kategorię między węzłami"
              sx={{
                bgcolor: "background.paper",
                boxShadow: 3,
                border: 2,
                borderColor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "white",
                },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CategoryEdge;
