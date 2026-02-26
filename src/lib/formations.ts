export interface FormationSlot {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label: string; // e.g. "GK", "CB", "ST"
}

export interface Formation {
  name: string;
  slots: FormationSlot[];
}

export const FORMATIONS: Record<string, Formation> = {
  // ── 3-back formations ────────────────────────────────────────────────

  "3-1-4-2": {
    name: "3-1-4-2",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 25, y: 75, label: "CB" },
      { x: 50, y: 78, label: "CB" },
      { x: 75, y: 75, label: "CB" },
      { x: 50, y: 62, label: "CDM" },
      { x: 15, y: 48, label: "LM" },
      { x: 38, y: 50, label: "CM" },
      { x: 62, y: 50, label: "CM" },
      { x: 85, y: 48, label: "RM" },
      { x: 38, y: 25, label: "ST" },
      { x: 62, y: 25, label: "ST" },
    ],
  },
  "3-4-1-2": {
    name: "3-4-1-2",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 25, y: 75, label: "CB" },
      { x: 50, y: 78, label: "CB" },
      { x: 75, y: 75, label: "CB" },
      { x: 15, y: 52, label: "LM" },
      { x: 38, y: 55, label: "CM" },
      { x: 62, y: 55, label: "CM" },
      { x: 85, y: 52, label: "RM" },
      { x: 50, y: 35, label: "CAM" },
      { x: 38, y: 20, label: "ST" },
      { x: 62, y: 20, label: "ST" },
    ],
  },
  "3-4-2-1": {
    name: "3-4-2-1",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 25, y: 75, label: "CB" },
      { x: 50, y: 78, label: "CB" },
      { x: 75, y: 75, label: "CB" },
      { x: 15, y: 52, label: "LM" },
      { x: 38, y: 55, label: "CM" },
      { x: 62, y: 55, label: "CM" },
      { x: 85, y: 52, label: "RM" },
      { x: 35, y: 32, label: "CF" },
      { x: 65, y: 32, label: "CF" },
      { x: 50, y: 18, label: "ST" },
    ],
  },
  "3-4-3": {
    name: "3-4-3",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 25, y: 75, label: "CB" },
      { x: 50, y: 78, label: "CB" },
      { x: 75, y: 75, label: "CB" },
      { x: 15, y: 52, label: "LM" },
      { x: 38, y: 55, label: "CM" },
      { x: 62, y: 55, label: "CM" },
      { x: 85, y: 52, label: "RM" },
      { x: 15, y: 25, label: "LW" },
      { x: 50, y: 20, label: "ST" },
      { x: 85, y: 25, label: "RW" },
    ],
  },
  "3-4-3 Flat": {
    name: "3-4-3 Flat",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 25, y: 75, label: "CB" },
      { x: 50, y: 78, label: "CB" },
      { x: 75, y: 75, label: "CB" },
      { x: 15, y: 52, label: "LM" },
      { x: 38, y: 52, label: "CM" },
      { x: 62, y: 52, label: "CM" },
      { x: 85, y: 52, label: "RM" },
      { x: 15, y: 25, label: "LW" },
      { x: 50, y: 20, label: "ST" },
      { x: 85, y: 25, label: "RW" },
    ],
  },
  "3-5-2": {
    name: "3-5-2",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 25, y: 75, label: "CB" },
      { x: 50, y: 78, label: "CB" },
      { x: 75, y: 75, label: "CB" },
      { x: 10, y: 50, label: "LWB" },
      { x: 35, y: 55, label: "CM" },
      { x: 50, y: 50, label: "CM" },
      { x: 65, y: 55, label: "CM" },
      { x: 90, y: 50, label: "RWB" },
      { x: 38, y: 25, label: "ST" },
      { x: 62, y: 25, label: "ST" },
    ],
  },

  // ── 4-back formations ────────────────────────────────────────────────

  "4-1-2-1-2": {
    name: "4-1-2-1-2",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 50, y: 62, label: "CDM" },
      { x: 30, y: 48, label: "CM" },
      { x: 70, y: 48, label: "CM" },
      { x: 50, y: 35, label: "CAM" },
      { x: 38, y: 20, label: "ST" },
      { x: 62, y: 20, label: "ST" },
    ],
  },
  "4-1-2-1-2 (2)": {
    name: "4-1-2-1-2 (2)",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 50, y: 60, label: "CDM" },
      { x: 25, y: 45, label: "LM" },
      { x: 75, y: 45, label: "RM" },
      { x: 50, y: 35, label: "CAM" },
      { x: 38, y: 20, label: "ST" },
      { x: 62, y: 20, label: "ST" },
    ],
  },
  "4-1-2-1-2 Narrow": {
    name: "4-1-2-1-2 Narrow",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 50, y: 62, label: "CDM" },
      { x: 35, y: 48, label: "CM" },
      { x: 65, y: 48, label: "CM" },
      { x: 50, y: 35, label: "CAM" },
      { x: 40, y: 20, label: "ST" },
      { x: 60, y: 20, label: "ST" },
    ],
  },
  "4-1-2-1-2 Wide": {
    name: "4-1-2-1-2 Wide",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 50, y: 62, label: "CDM" },
      { x: 20, y: 48, label: "LM" },
      { x: 80, y: 48, label: "RM" },
      { x: 50, y: 35, label: "CAM" },
      { x: 38, y: 20, label: "ST" },
      { x: 62, y: 20, label: "ST" },
    ],
  },
  "4-1-3-2": {
    name: "4-1-3-2",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 50, y: 58, label: "CDM" },
      { x: 25, y: 40, label: "LM" },
      { x: 50, y: 42, label: "CAM" },
      { x: 75, y: 40, label: "RM" },
      { x: 38, y: 22, label: "ST" },
      { x: 62, y: 22, label: "ST" },
    ],
  },
  "4-1-4-1": {
    name: "4-1-4-1",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 50, y: 60, label: "CDM" },
      { x: 15, y: 42, label: "LM" },
      { x: 38, y: 45, label: "CM" },
      { x: 62, y: 45, label: "CM" },
      { x: 85, y: 42, label: "RM" },
      { x: 50, y: 20, label: "ST" },
    ],
  },
  "4-2-1-3": {
    name: "4-2-1-3",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 35, y: 58, label: "CDM" },
      { x: 65, y: 58, label: "CDM" },
      { x: 50, y: 40, label: "CAM" },
      { x: 15, y: 25, label: "LW" },
      { x: 50, y: 20, label: "ST" },
      { x: 85, y: 25, label: "RW" },
    ],
  },
  "4-2-2-2": {
    name: "4-2-2-2",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 35, y: 58, label: "CDM" },
      { x: 65, y: 58, label: "CDM" },
      { x: 35, y: 40, label: "CAM" },
      { x: 65, y: 40, label: "CAM" },
      { x: 38, y: 22, label: "ST" },
      { x: 62, y: 22, label: "ST" },
    ],
  },
  "4-2-3-1": {
    name: "4-2-3-1",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 35, y: 58, label: "CDM" },
      { x: 65, y: 58, label: "CDM" },
      { x: 15, y: 38, label: "LM" },
      { x: 50, y: 38, label: "CAM" },
      { x: 85, y: 38, label: "RM" },
      { x: 50, y: 18, label: "ST" },
    ],
  },
  "4-2-3-1 (2)": {
    name: "4-2-3-1 (2)",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 35, y: 56, label: "CDM" },
      { x: 65, y: 56, label: "CDM" },
      { x: 25, y: 38, label: "LM" },
      { x: 50, y: 35, label: "CAM" },
      { x: 75, y: 38, label: "RM" },
      { x: 50, y: 18, label: "ST" },
    ],
  },
  "4-2-3-1 Narrow": {
    name: "4-2-3-1 Narrow",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 35, y: 58, label: "CDM" },
      { x: 65, y: 58, label: "CDM" },
      { x: 25, y: 38, label: "CM" },
      { x: 50, y: 36, label: "CAM" },
      { x: 75, y: 38, label: "CM" },
      { x: 50, y: 18, label: "ST" },
    ],
  },
  "4-2-3-1 Wide": {
    name: "4-2-3-1 Wide",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 35, y: 58, label: "CDM" },
      { x: 65, y: 58, label: "CDM" },
      { x: 10, y: 38, label: "LW" },
      { x: 50, y: 38, label: "CAM" },
      { x: 90, y: 38, label: "RW" },
      { x: 50, y: 18, label: "ST" },
    ],
  },
  "4-2-4": {
    name: "4-2-4",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 35, y: 52, label: "CDM" },
      { x: 65, y: 52, label: "CDM" },
      { x: 15, y: 25, label: "LW" },
      { x: 38, y: 22, label: "ST" },
      { x: 62, y: 22, label: "ST" },
      { x: 85, y: 25, label: "RW" },
    ],
  },
  "4-3-1-2": {
    name: "4-3-1-2",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 25, y: 55, label: "CM" },
      { x: 50, y: 58, label: "CM" },
      { x: 75, y: 55, label: "CM" },
      { x: 50, y: 38, label: "CAM" },
      { x: 38, y: 22, label: "ST" },
      { x: 62, y: 22, label: "ST" },
    ],
  },
  "4-3-2-1": {
    name: "4-3-2-1",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 25, y: 55, label: "CM" },
      { x: 50, y: 58, label: "CM" },
      { x: 75, y: 55, label: "CM" },
      { x: 35, y: 35, label: "CF" },
      { x: 65, y: 35, label: "CF" },
      { x: 50, y: 18, label: "ST" },
    ],
  },
  "4-3-3": {
    name: "4-3-3",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 25, y: 52, label: "CM" },
      { x: 50, y: 55, label: "CM" },
      { x: 75, y: 52, label: "CM" },
      { x: 15, y: 28, label: "LW" },
      { x: 50, y: 22, label: "ST" },
      { x: 85, y: 28, label: "RW" },
    ],
  },
  "4-3-3 (2)": {
    name: "4-3-3 (2)",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 50, y: 58, label: "CDM" },
      { x: 30, y: 48, label: "CM" },
      { x: 70, y: 48, label: "CM" },
      { x: 15, y: 28, label: "LW" },
      { x: 50, y: 22, label: "ST" },
      { x: 85, y: 28, label: "RW" },
    ],
  },
  "4-3-3 (3)": {
    name: "4-3-3 (3)",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 30, y: 55, label: "CM" },
      { x: 70, y: 55, label: "CM" },
      { x: 50, y: 42, label: "CAM" },
      { x: 15, y: 28, label: "LW" },
      { x: 50, y: 22, label: "ST" },
      { x: 85, y: 28, label: "RW" },
    ],
  },
  "4-3-3 (4)": {
    name: "4-3-3 (4)",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 35, y: 58, label: "CDM" },
      { x: 65, y: 58, label: "CDM" },
      { x: 50, y: 45, label: "CM" },
      { x: 15, y: 28, label: "LW" },
      { x: 50, y: 22, label: "ST" },
      { x: 85, y: 28, label: "RW" },
    ],
  },
  "4-3-3 Attack": {
    name: "4-3-3 Attack",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 50, y: 52, label: "CM" },
      { x: 30, y: 40, label: "CAM" },
      { x: 70, y: 40, label: "CAM" },
      { x: 15, y: 25, label: "LW" },
      { x: 50, y: 20, label: "ST" },
      { x: 85, y: 25, label: "RW" },
    ],
  },
  "4-3-3 Defend": {
    name: "4-3-3 Defend",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 25, y: 58, label: "CDM" },
      { x: 50, y: 60, label: "CDM" },
      { x: 75, y: 58, label: "CDM" },
      { x: 15, y: 28, label: "LW" },
      { x: 50, y: 22, label: "ST" },
      { x: 85, y: 28, label: "RW" },
    ],
  },
  "4-3-3 Flat": {
    name: "4-3-3 Flat",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 25, y: 52, label: "CM" },
      { x: 50, y: 52, label: "CM" },
      { x: 75, y: 52, label: "CM" },
      { x: 15, y: 28, label: "LW" },
      { x: 50, y: 22, label: "ST" },
      { x: 85, y: 28, label: "RW" },
    ],
  },
  "4-3-3 Holding": {
    name: "4-3-3 Holding",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 50, y: 60, label: "CDM" },
      { x: 30, y: 50, label: "CM" },
      { x: 70, y: 50, label: "CM" },
      { x: 15, y: 28, label: "LW" },
      { x: 50, y: 22, label: "ST" },
      { x: 85, y: 28, label: "RW" },
    ],
  },
  "4-4-1-1 (2)": {
    name: "4-4-1-1 (2)",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 15, y: 48, label: "LM" },
      { x: 38, y: 52, label: "CM" },
      { x: 62, y: 52, label: "CM" },
      { x: 85, y: 48, label: "RM" },
      { x: 50, y: 32, label: "CF" },
      { x: 50, y: 18, label: "ST" },
    ],
  },
  "4-4-1-1 Midfield": {
    name: "4-4-1-1 Midfield",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 15, y: 48, label: "LM" },
      { x: 38, y: 52, label: "CM" },
      { x: 62, y: 52, label: "CM" },
      { x: 85, y: 48, label: "RM" },
      { x: 50, y: 38, label: "CAM" },
      { x: 50, y: 20, label: "ST" },
    ],
  },
  "4-4-2": {
    name: "4-4-2",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 15, y: 50, label: "LM" },
      { x: 38, y: 52, label: "CM" },
      { x: 62, y: 52, label: "CM" },
      { x: 85, y: 50, label: "RM" },
      { x: 38, y: 25, label: "ST" },
      { x: 62, y: 25, label: "ST" },
    ],
  },
  "4-4-2 (2)": {
    name: "4-4-2 (2)",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 15, y: 50, label: "LM" },
      { x: 38, y: 55, label: "CDM" },
      { x: 62, y: 55, label: "CDM" },
      { x: 85, y: 50, label: "RM" },
      { x: 38, y: 25, label: "ST" },
      { x: 62, y: 25, label: "ST" },
    ],
  },
  "4-4-2 Flat": {
    name: "4-4-2 Flat",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 15, y: 50, label: "LM" },
      { x: 38, y: 50, label: "CM" },
      { x: 62, y: 50, label: "CM" },
      { x: 85, y: 50, label: "RM" },
      { x: 38, y: 25, label: "ST" },
      { x: 62, y: 25, label: "ST" },
    ],
  },
  "4-4-2 Holding": {
    name: "4-4-2 Holding",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 15, y: 52, label: "LM" },
      { x: 38, y: 58, label: "CDM" },
      { x: 62, y: 58, label: "CDM" },
      { x: 85, y: 52, label: "RM" },
      { x: 38, y: 25, label: "ST" },
      { x: 62, y: 25, label: "ST" },
    ],
  },
  "4-5-1": {
    name: "4-5-1",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 15, y: 48, label: "LM" },
      { x: 35, y: 55, label: "CM" },
      { x: 50, y: 42, label: "CAM" },
      { x: 65, y: 55, label: "CM" },
      { x: 85, y: 48, label: "RM" },
      { x: 50, y: 20, label: "ST" },
    ],
  },
  "4-5-1 (2)": {
    name: "4-5-1 (2)",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 15, y: 48, label: "LM" },
      { x: 35, y: 52, label: "CM" },
      { x: 50, y: 58, label: "CDM" },
      { x: 65, y: 52, label: "CM" },
      { x: 85, y: 48, label: "RM" },
      { x: 50, y: 20, label: "ST" },
    ],
  },
  "4-5-1 Attack": {
    name: "4-5-1 Attack",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 15, y: 42, label: "LM" },
      { x: 35, y: 48, label: "CM" },
      { x: 50, y: 38, label: "CAM" },
      { x: 65, y: 48, label: "CM" },
      { x: 85, y: 42, label: "RM" },
      { x: 50, y: 18, label: "ST" },
    ],
  },
  "4-5-1 Flat": {
    name: "4-5-1 Flat",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 15, y: 72, label: "LB" },
      { x: 38, y: 75, label: "CB" },
      { x: 62, y: 75, label: "CB" },
      { x: 85, y: 72, label: "RB" },
      { x: 15, y: 50, label: "LM" },
      { x: 35, y: 50, label: "CM" },
      { x: 50, y: 50, label: "CM" },
      { x: 65, y: 50, label: "CM" },
      { x: 85, y: 50, label: "RM" },
      { x: 50, y: 20, label: "ST" },
    ],
  },

  // ── 5-back formations ────────────────────────────────────────────────

  "5-2-1-2": {
    name: "5-2-1-2",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 10, y: 70, label: "LWB" },
      { x: 30, y: 75, label: "CB" },
      { x: 50, y: 78, label: "CB" },
      { x: 70, y: 75, label: "CB" },
      { x: 90, y: 70, label: "RWB" },
      { x: 35, y: 52, label: "CM" },
      { x: 65, y: 52, label: "CM" },
      { x: 50, y: 38, label: "CAM" },
      { x: 38, y: 22, label: "ST" },
      { x: 62, y: 22, label: "ST" },
    ],
  },
  "5-2-3": {
    name: "5-2-3",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 10, y: 70, label: "LWB" },
      { x: 30, y: 75, label: "CB" },
      { x: 50, y: 78, label: "CB" },
      { x: 70, y: 75, label: "CB" },
      { x: 90, y: 70, label: "RWB" },
      { x: 35, y: 50, label: "CM" },
      { x: 65, y: 50, label: "CM" },
      { x: 15, y: 25, label: "LW" },
      { x: 50, y: 22, label: "ST" },
      { x: 85, y: 25, label: "RW" },
    ],
  },
  "5-3-2": {
    name: "5-3-2",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 10, y: 70, label: "LWB" },
      { x: 30, y: 75, label: "CB" },
      { x: 50, y: 78, label: "CB" },
      { x: 70, y: 75, label: "CB" },
      { x: 90, y: 70, label: "RWB" },
      { x: 30, y: 52, label: "CM" },
      { x: 50, y: 50, label: "CM" },
      { x: 70, y: 52, label: "CM" },
      { x: 38, y: 25, label: "ST" },
      { x: 62, y: 25, label: "ST" },
    ],
  },
  "5-3-2 Holding": {
    name: "5-3-2 Holding",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 10, y: 70, label: "LWB" },
      { x: 30, y: 75, label: "CB" },
      { x: 50, y: 78, label: "CB" },
      { x: 70, y: 75, label: "CB" },
      { x: 90, y: 70, label: "RWB" },
      { x: 30, y: 55, label: "CM" },
      { x: 50, y: 58, label: "CDM" },
      { x: 70, y: 55, label: "CM" },
      { x: 38, y: 25, label: "ST" },
      { x: 62, y: 25, label: "ST" },
    ],
  },
  "5-4-1": {
    name: "5-4-1",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 10, y: 70, label: "LWB" },
      { x: 30, y: 75, label: "CB" },
      { x: 50, y: 78, label: "CB" },
      { x: 70, y: 75, label: "CB" },
      { x: 90, y: 70, label: "RWB" },
      { x: 15, y: 48, label: "LM" },
      { x: 38, y: 50, label: "CM" },
      { x: 62, y: 50, label: "CM" },
      { x: 85, y: 48, label: "RM" },
      { x: 50, y: 22, label: "ST" },
    ],
  },
  "5-4-1 Flat": {
    name: "5-4-1 Flat",
    slots: [
      { x: 50, y: 90, label: "GK" },
      { x: 10, y: 70, label: "LWB" },
      { x: 30, y: 75, label: "CB" },
      { x: 50, y: 78, label: "CB" },
      { x: 70, y: 75, label: "CB" },
      { x: 90, y: 70, label: "RWB" },
      { x: 15, y: 50, label: "LM" },
      { x: 38, y: 50, label: "CM" },
      { x: 62, y: 50, label: "CM" },
      { x: 85, y: 50, label: "RM" },
      { x: 50, y: 22, label: "ST" },
    ],
  },
};

export const FORMATION_NAMES = Object.keys(FORMATIONS);

// ── Position-matching for formation changes ────────────────────────────

const POSITION_FAMILY: Record<string, string[]> = {
  LB: ["LWB"],
  LWB: ["LB"],
  RB: ["RWB"],
  RWB: ["RB"],
  CDM: ["CM"],
  CM: ["CDM", "CAM"],
  CAM: ["CM", "CF"],
  LW: ["LM"],
  LM: ["LW"],
  RW: ["RM"],
  RM: ["RW"],
  ST: ["CF"],
  CF: ["ST", "CAM"],
};

interface PlayerForAssignment {
  playerId: number;
  position: string;
  alternativePositions: string[];
}

function slotScore(player: PlayerForAssignment, slotLabel: string): number {
  if (player.position === slotLabel) return 100;
  if (player.alternativePositions.includes(slotLabel)) return 80;
  if (POSITION_FAMILY[player.position]?.includes(slotLabel)) return 60;
  return 1;
}

/**
 * Given a list of existing FIRST_XI players and a target formation,
 * returns a Map<playerId, newSlotIndex> assigning each player
 * to the best-matching slot in the new formation.
 */
export function assignPlayersToFormation(
  players: PlayerForAssignment[],
  formationName: string,
): Map<number, number> {
  const formation = FORMATIONS[formationName] ?? FORMATIONS["4-3-3"];
  const slots = formation.slots;

  // Build all (player, slotIndex) pairs with scores
  const pairs: { playerId: number; slotIndex: number; score: number }[] = [];
  for (const player of players) {
    for (let i = 0; i < slots.length; i++) {
      pairs.push({
        playerId: player.playerId,
        slotIndex: i,
        score: slotScore(player, slots[i].label),
      });
    }
  }

  // Sort by score descending
  pairs.sort((a, b) => b.score - a.score);

  // Greedy assignment
  const assignedPlayers = new Set<number>();
  const assignedSlots = new Set<number>();
  const result = new Map<number, number>();

  for (const pair of pairs) {
    if (assignedPlayers.has(pair.playerId) || assignedSlots.has(pair.slotIndex)) continue;
    result.set(pair.playerId, pair.slotIndex);
    assignedPlayers.add(pair.playerId);
    assignedSlots.add(pair.slotIndex);
  }

  return result;
}
