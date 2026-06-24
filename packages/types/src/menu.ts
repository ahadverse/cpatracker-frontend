// Shape for the data-driven sidebar menu config each app passes to the shared
// sidebar (packages/ui, built in Stage 1). Routes don't need to resolve to real
// pages yet — apps/*/src/menu.ts populate this now so Stage 1's sidebar and
// Stages 3-5's routers both have a real config to wire against.
export interface MenuItem {
  label: string;
  path: string;
  children?: MenuItem[];
}

export interface MenuGroup {
  label?: string;
  items: MenuItem[];
}

export interface MenuConfig {
  groups: MenuGroup[];
}
