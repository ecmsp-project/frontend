import React, { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
} from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Box, Typography } from "@mui/material";
import type { CategoryFromAPI } from "../../../types/cms";
import type { CategoryTreeNode } from "../../../types/category";
import CategoryNode from "./CategoryNode";
import CategoryEdge from "./CategoryEdge";

interface CategoryTreeProps {
  categories: CategoryFromAPI[];
  onAddLeaf: (categoryId: string, categoryName: string) => void;
  onAddBetween: (parentId: string, childId: string, parentName: string, childName: string) => void;
  onDelete: (category: CategoryFromAPI) => void;
}

// Custom node types for React Flow
const nodeTypes = {
  categoryNode: CategoryNode,
};

// Custom edge types for React Flow
const edgeTypes = {
  categoryEdge: CategoryEdge,
};

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  onAddLeaf,
  onAddBetween,
  onDelete,
}) => {
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

    console.log('CategoryTree: Building tree for categories:', categories.length);

    if (categories.length === 0) {
      console.log('CategoryTree: No categories to display');
      return { nodes, edges };
    }

    const tree = buildTree(categories);
    console.log('CategoryTree: Built tree structure:', tree.length, 'roots');

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

    console.log('CategoryTree: Generated', nodes.length, 'nodes and', edges.length, 'edges');
    console.log('CategoryTree: Nodes:', nodes);
    console.log('CategoryTree: Edges:', edges);

    return { nodes, edges };
  }, [categories, buildTree, onAddLeaf, onAddBetween, onDelete]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Update nodes and edges when categories change
  React.useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  return (
    <Box sx={{ width: "100%", height: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
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
              Liczba kategorii: {categories.length}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Kliknij na krawędź aby dodać kategorię między węzłami
            </Typography>
          </Box>
        </Panel>
      </ReactFlow>
    </Box>
  );
};

export default CategoryTree;
