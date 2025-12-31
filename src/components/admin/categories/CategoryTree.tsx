import React, { useMemo, useCallback, useState, useRef } from "react";
import type { CategoryTreeNode } from "../../../types/category";
import type { CategoryFromAPI } from "../../../types/cms";
import CategoryEdge from "./CategoryEdge";
import CategoryNode from "./CategoryNode";
import {
  Fullscreen,
  FullscreenExit,
  AccountTree,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { Box, Typography, IconButton, Button } from "@mui/material";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";

interface CategoryTreeProps {
  categories: CategoryFromAPI[];
  onAddLeaf: (categoryId: string, categoryName: string) => void;
  onAddBetween: (parentId: string, childId: string, parentName: string, childName: string) => void;
  onDelete: (category: CategoryFromAPI) => void;
  newlyAddedCategoryId?: string | null;
  onAddRootCategory: () => void;
  onRefresh: () => void;
}

// Custom node types for React Flow
const nodeTypes = {
  categoryNode: CategoryNode,
};

// Custom edge types for React Flow
const edgeTypes = {
  categoryEdge: CategoryEdge,
};

// Dagre layout configuration
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure the graph
  const nodeWidth = 250;
  const nodeHeight = 120;

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 150, // Horizontal spacing between nodes at the same level
    edgesep: 100, // Spacing between edges
    ranksep: 250, // Vertical spacing between levels
    marginx: 50,
    marginy: 50,
  });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply the calculated positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Internal component that uses useReactFlow
const CategoryTreeInner: React.FC<CategoryTreeProps> = ({
  categories,
  onAddLeaf,
  onAddBetween,
  onDelete,
  newlyAddedCategoryId,
  onAddRootCategory,
  onRefresh,
}) => {
  const reactFlowInstance = useReactFlow();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAutoLayoutRun, setHasAutoLayoutRun] = useState(false);
  // Build tree structure from flat list
  const buildTree = useCallback((flatCategories: CategoryFromAPI[]): CategoryTreeNode[] => {
    const categoryMap = new Map<string, CategoryTreeNode>();

    // First pass: create all nodes
    flatCategories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: build parent-child relationships
    const roots: CategoryTreeNode[] = [];
    flatCategories.forEach((cat) => {
      const node = categoryMap.get(cat.id)!;
      if (cat.parentCategoryId) {
        const parent = categoryMap.get(cat.parentCategoryId);
        if (parent) {
          parent.children.push(node);
        } else {
          // Parent not found, treat as root
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, []);

  // Convert tree to React Flow nodes and edges
  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (categories.length === 0) {
      return { nodes, edges };
    }

    const tree = buildTree(categories);

    // Layout constants
    const NODE_WIDTH = 250;
    const NODE_HEIGHT = 120;
    const HORIZONTAL_SPACING = 500; // Significantly increased
    const VERTICAL_SPACING = 300; // Significantly increased

    // Recursive layout function
    const layoutNode = (
      node: CategoryTreeNode,
      level: number,
      position: { x: number; y: number },
      parentId?: string,
    ): number => {
      const nodeId = node.id;

      // Add node
      nodes.push({
        id: nodeId,
        type: "categoryNode",
        position,
        data: {
          category: node,
          onAddLeaf: (categoryId: string) => onAddLeaf(categoryId, node.name),
          onDelete: () => onDelete(node),
        },
      });

      // Add edge from parent
      if (parentId) {
        const parentCategory = categories.find((c) => c.id === parentId);
        const edgeId = `${parentId}-${nodeId}`;

        edges.push({
          id: edgeId,
          source: parentId,
          target: nodeId,
          type: "categoryEdge",
          data: {
            onAddBetween: () => {
              if (parentCategory) {
                onAddBetween(parentId, nodeId, parentCategory.name, node.name);
              }
            },
          },
        });
      }

      // Layout children
      if (node.children.length > 0) {
        // Calculate total width needed for children
        const totalChildrenWidth =
          node.children.length * NODE_WIDTH + (node.children.length - 1) * HORIZONTAL_SPACING;

        // Start from left to center children under parent
        let childX = position.x - totalChildrenWidth / 2 + NODE_WIDTH / 2;

        node.children.forEach((child) => {
          const childPosition = {
            x: childX,
            y: position.y + NODE_HEIGHT + VERTICAL_SPACING,
          };

          layoutNode(child, level + 1, childPosition, nodeId);

          // Move to next child position
          childX += NODE_WIDTH + HORIZONTAL_SPACING;
        });
      }

      return position.x;
    };

    // Layout root nodes
    let rootX = 100;
    tree.forEach((root) => {
      layoutNode(root, 0, { x: rootX, y: 50 });
      rootX += NODE_WIDTH + HORIZONTAL_SPACING + 600; // Extra spacing between root trees
    });

    return { nodes, edges };
  }, [categories, buildTree, onAddLeaf, onAddBetween, onDelete]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Update nodes and edges when categories change
  React.useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);

    // Mark as initialized after first render
    if (!isInitialized && flowNodes.length > 0) {
      setIsInitialized(true);
    }
  }, [flowNodes, flowEdges, setNodes, setEdges, isInitialized]);

  // Focus on newly added category
  React.useEffect(() => {
    if (newlyAddedCategoryId && nodes.length > 0) {
      // Find the newly added node
      const newNode = nodes.find((node) => node.id === newlyAddedCategoryId);

      if (newNode) {
        // Wait a bit for the node to be rendered
        setTimeout(() => {
          // Get current zoom to maintain it
          const currentZoom = reactFlowInstance.getZoom();

          // Center the camera on the new node with smooth animation
          reactFlowInstance.setCenter(
            newNode.position.x + 125, // Center of node (nodeWidth / 2)
            newNode.position.y + 60, // Center of node (nodeHeight / 2)
            {
              zoom: currentZoom, // Keep current zoom level
              duration: 800, // Smooth animation
            },
          );
        }, 100);
      }
    }
  }, [newlyAddedCategoryId, nodes, reactFlowInstance]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Error entering fullscreen:", err);
        });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Auto layout function
  const onAutoLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges, "TB");
    setNodes(layouted.nodes);
    setEdges(layouted.edges);

    // Fit view after layout
    window.requestAnimationFrame(() => {
      reactFlowInstance.fitView({ padding: 0.2, duration: 400 });
    });

    setHasAutoLayoutRun(true);
  }, [nodes, edges, setNodes, setEdges, reactFlowInstance]);

  // Run auto layout on initial load
  React.useEffect(() => {
    if (!hasAutoLayoutRun && nodes.length > 0 && isInitialized) {
      // Wait a bit for nodes to be rendered
      setTimeout(() => {
        onAutoLayout();
      }, 300);
    }
  }, [hasAutoLayoutRun, nodes.length, isInitialized, onAutoLayout]);

  // Apply highlight style to newly added node
  const nodesWithHighlight = React.useMemo(() => {
    return nodes.map((node) => {
      if (node.id === newlyAddedCategoryId) {
        return {
          ...node,
          style: {
            ...node.style,
            animation: "pulse 2s ease-in-out 3",
          },
          className: "newly-added-node",
        };
      }
      return node;
    });
  }, [nodes, newlyAddedCategoryId]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: isFullscreen ? "100vh" : 600,
        position: isFullscreen ? "fixed" : "relative",
        top: isFullscreen ? 0 : "auto",
        left: isFullscreen ? 0 : "auto",
        zIndex: isFullscreen ? 9999 : "auto",
        bgcolor: "background.paper",
      }}
    >
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
            }
            50% {
              box-shadow: 0 0 0 20px rgba(25, 118, 210, 0);
            }
          }

          .newly-added-node {
            animation: pulse 2s ease-in-out 3;
          }
        `}
      </style>
      {categories.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click the "Add Root" button in the top right corner to add the first category
          </Typography>
        </Box>
      ) : (
        <ReactFlow
          nodes={nodesWithHighlight}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView={!isInitialized && nodes.length > 0}
          fitViewOptions={{ padding: 0.2, duration: 200 }}
          minZoom={0.1}
          maxZoom={1.5}
        >
          <Background />
          <Controls />
          <MiniMap
            nodeColor={() => {
              return "#1976d2";
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          <Panel position="top-left">
            <Box
              sx={{
                bgcolor: "background.paper",
                p: 1.5,
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <Typography variant="caption" display="block">
                Number of categories: {categories.length}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                Click on an edge to add a category between nodes
              </Typography>
            </Box>
          </Panel>
          <Panel position="top-right">
            <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={onAddRootCategory}
                sx={{
                  bgcolor: "success.main",
                  boxShadow: 2,
                  "&:hover": {
                    bgcolor: "success.dark",
                  },
                }}
                title="Add root category"
              >
                Add Root
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                sx={{
                  boxShadow: 1,
                  bgcolor: "background.paper",
                }}
                title="Refresh categories"
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<AccountTree />}
                onClick={onAutoLayout}
                sx={{
                  bgcolor: "primary.main",
                  boxShadow: 2,
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
                title="Automatically arrange elements so they don't overlap"
              >
                Auto Layout
              </Button>
              <IconButton
                onClick={toggleFullscreen}
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: 2,
                  "&:hover": {
                    bgcolor: "primary.light",
                    color: "white",
                  },
                }}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Box>
          </Panel>
        </ReactFlow>
      )}

      {/* Floating action buttons - always visible */}
      {categories.length === 0 && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            gap: 1,
            flexDirection: "column",
            zIndex: 10,
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={onAddRootCategory}
            sx={{
              bgcolor: "success.main",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "success.dark",
              },
            }}
            title="Add root category"
          >
            Add Root
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            sx={{
              boxShadow: 1,
              bgcolor: "background.paper",
            }}
            title="Refresh categories"
          >
            Refresh
          </Button>
        </Box>
      )}
    </Box>
  );
};

// Wrapper component with ReactFlowProvider
const CategoryTree: React.FC<CategoryTreeProps> = (props) => {
  return (
    <ReactFlowProvider>
      <CategoryTreeInner {...props} />
    </ReactFlowProvider>
  );
};

export default CategoryTree;
