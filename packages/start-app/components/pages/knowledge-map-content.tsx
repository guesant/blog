'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import type { GraphEdge, GraphNode, GraphNodeKind } from '@portfolio/content/types';
import {
  Background,
  Controls,
  type Edge,
  Handle,
  MiniMap,
  type Node,
  type NodeMouseHandler,
  type NodeProps,
  Position,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { useTranslations } from '@/i18n/compat';
import { useCallback, useMemo, useState } from 'react';
import { Link } from '../../i18n/navigation';

type KnowledgeMapContentProps = { nodes: GraphNode[]; edges: GraphEdge[] };

type FlowNodeData = { node: GraphNode; selected: boolean } & Record<string, unknown>;

const NODE_WIDTH = 200;
const NODE_HEIGHT = 48;

function layoutPositions(nodes: GraphNode[], edges: GraphEdge[]) {
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: 'LR', nodesep: 32, ranksep: 96 });
  graph.setDefaultEdgeLabel(() => ({}));
  for (const node of nodes) {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
      graph.setEdge(edge.source, edge.target);
    }
  }
  dagre.layout(graph);
  const positions = new Map<string, { x: number; y: number }>();
  for (const node of nodes) {
    const position = graph.node(node.id);
    positions.set(node.id, {
      x: (position?.x ?? 0) - NODE_WIDTH / 2,
      y: (position?.y ?? 0) - NODE_HEIGHT / 2,
    });
  }
  return positions;
}

function hrefForNode(node: GraphNode) {
  return node.kind === 'topic' ? `/topics/${node.id}` : `/findings/${node.id}`;
}

function graphNodeBorderColor(selected: boolean, isTopic: boolean) {
  if (selected) {
    return 'secondary.main';
  }
  return isTopic ? 'primary.main' : 'divider';
}

function graphEdgeId(index: number) {
  return `edge-${index}`;
}

function GraphNodeCard(props: NodeProps) {
  const { node, selected } = props.data as FlowNodeData;
  const isTopic = node.kind === 'topic';
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 1.5,
        border: 2,
        borderColor: graphNodeBorderColor(selected, isTopic),
        bgcolor: isTopic ? 'primary.light' : 'background.paper',
        color: 'text.primary',
        minWidth: NODE_WIDTH - 16,
        maxWidth: NODE_WIDTH - 16,
        boxShadow: selected ? 3 : 0,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} />
      <Typography variant="body2" sx={{ fontWeight: isTopic ? 700 : 500 }} noWrap>
        {node.label}
      </Typography>
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
    </Box>
  );
}

const nodeTypes = { graphNode: GraphNodeCard };

function useFilteredGraph(
  nodes: GraphNode[],
  edges: GraphEdge[],
  kindFilter: 'all' | GraphNodeKind,
  relationFilter: string,
) {
  const filteredNodes = useMemo(
    () => (kindFilter === 'all' ? nodes : nodes.filter((node) => node.kind === kindFilter)),
    [nodes, kindFilter],
  );
  const filteredNodeIds = useMemo(
    () => new Set(filteredNodes.map((node) => node.id)),
    [filteredNodes],
  );
  const filteredEdges = useMemo(
    () =>
      edges.filter(
        (edge) =>
          filteredNodeIds.has(edge.source) &&
          filteredNodeIds.has(edge.target) &&
          (relationFilter === 'all' || edge.relationType === relationFilter),
      ),
    [edges, filteredNodeIds, relationFilter],
  );
  return { filteredNodes, filteredEdges };
}

function useFlowElements(
  filteredNodes: GraphNode[],
  filteredEdges: GraphEdge[],
  selectedId: string | undefined,
) {
  const theme = useTheme();
  const positions = useMemo(
    () => layoutPositions(filteredNodes, filteredEdges),
    [filteredNodes, filteredEdges],
  );
  const flowNodes: Node[] = useMemo(
    () =>
      filteredNodes.map((node) => ({
        id: node.id,
        type: 'graphNode',
        position: positions.get(node.id) ?? { x: 0, y: 0 },
        data: { node, selected: node.id === selectedId } satisfies FlowNodeData,
        draggable: true,
      })),
    [filteredNodes, positions, selectedId],
  );
  const flowEdges: Edge[] = useMemo(
    () =>
      filteredEdges.map((edge, index) => ({
        id: graphEdgeId(index),
        source: edge.source,
        target: edge.target,
        label: edge.relationType === 'has-topic' ? undefined : edge.label,
        style: { stroke: theme.palette.divider },
        labelStyle: { fill: theme.palette.text.secondary, fontSize: 11 },
      })),
    [filteredEdges, theme],
  );
  return { flowNodes, flowEdges };
}

function useSelectedGraphNode(
  nodes: GraphNode[],
  edges: GraphEdge[],
  selectedId: string | undefined,
) {
  const nodesById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const selectedNode = selectedId ? nodesById.get(selectedId) : undefined;
  const selectedEdges = useMemo(
    () =>
      selectedId
        ? edges.filter((edge) => edge.source === selectedId || edge.target === selectedId)
        : [],
    [edges, selectedId],
  );
  return { nodesById, selectedNode, selectedEdges };
}

export function KnowledgeMapContent(props: KnowledgeMapContentProps) {
  const { nodes, edges } = props;
  const t = useTranslations('Pages.knowledgeMap');
  const [kindFilter, setKindFilter] = useState<'all' | GraphNodeKind>('all');
  const [relationFilter, setRelationFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const relationTypeOptions = useMemo(
    () => [...new Set(edges.map((edge) => edge.relationType))].sort(),
    [edges],
  );

  const { filteredNodes, filteredEdges } = useFilteredGraph(
    nodes,
    edges,
    kindFilter,
    relationFilter,
  );
  const { flowNodes, flowEdges } = useFlowElements(filteredNodes, filteredEdges, selectedId);
  const { nodesById, selectedNode, selectedEdges } = useSelectedGraphNode(nodes, edges, selectedId);

  const handleNodeClick = useCallback<NodeMouseHandler>((_event, node) => {
    setSelectedId(node.id);
  }, []);

  const handleReset = useCallback(() => {
    setKindFilter('all');
    setRelationFilter('all');
    setSelectedId(undefined);
  }, []);

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 1 }}>
        {t('title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('description')}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <ToggleButtonGroup
          value={kindFilter}
          exclusive
          size="small"
          onChange={(_event, value: 'all' | GraphNodeKind | null) => {
            if (value) {
              setKindFilter(value);
            }
          }}
        >
          <ToggleButton value="all">{t('kindFilterLabel')}</ToggleButton>
          <ToggleButton value="reference">{t('nodeKindReference')}</ToggleButton>
          <ToggleButton value="topic">{t('nodeKindTopic')}</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          select
          size="small"
          label={t('relationFilterLabel')}
          value={relationFilter}
          onChange={(event) => setRelationFilter(event.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">{t('relationFilterLabel')}</MenuItem>
          {relationTypeOptions.map((relationType) => (
            <MenuItem key={relationType} value={relationType}>
              {relationType}
            </MenuItem>
          ))}
        </TextField>

        <Button size="small" onClick={handleReset}>
          {t('resetView')}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch', flexWrap: 'wrap' }}>
        <Box
          sx={{
            flex: '1 1 32rem',
            height: 560,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {filteredNodes.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography color="text.secondary">{t('noResults')}</Typography>
            </Box>
          ) : (
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={nodeTypes}
              onNodeClick={handleNodeClick}
              fitView
              proOptions={{ hideAttribution: true }}
            >
              <Background />
              <Controls showInteractive={false} />
              <MiniMap pannable zoomable />
            </ReactFlow>
          )}
        </Box>

        <Paper variant="outlined" sx={{ width: 300, p: 2, flexShrink: 0 }}>
          {!selectedNode ? (
            <Typography color="text.secondary">{t('panelEmptyLabel')}</Typography>
          ) : (
            <Box>
              <Typography variant="overline" color="text.secondary">
                {selectedNode.kind === 'topic' ? t('nodeKindTopic') : t('nodeKindReference')}
              </Typography>
              <Typography variant="h3" sx={{ mb: 1 }}>
                {selectedNode.label}
              </Typography>
              <Button component={Link} href={hrefForNode(selectedNode)} size="small" sx={{ mb: 2 }}>
                {t('panelOpenLabel')}
              </Button>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {selectedEdges.map((edge, index) => {
                  const otherId = edge.source === selectedId ? edge.target : edge.source;
                  const otherNode = nodesById.get(otherId);
                  if (!otherNode) {
                    return null;
                  }
                  return (
                    <Button
                      key={graphEdgeId(index)}
                      component={Link}
                      href={hrefForNode(otherNode)}
                      size="small"
                      variant="outlined"
                      sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                      {edge.label ?? edge.relationType} → {otherNode.label}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
