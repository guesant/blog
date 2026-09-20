import { toolCatalog, toolLabel } from '@portfolio/data/config/tool-catalog';

type FilterToolsOptions = {
  category: string;
  locale: string;
  search: string;
};

export function filterTools(props: FilterToolsOptions) {
  return toolCatalog.filter((tool) => {
    const matchesCategory = !props.category || tool.category === props.category;

    const matchesSearch =
      !props.search ||
      `${tool.slug} ${tool.category} ${toolLabel(tool.slug, props.locale)}`.includes(
        props.search.toLowerCase(),
      );

    return matchesCategory && matchesSearch;
  });
}
