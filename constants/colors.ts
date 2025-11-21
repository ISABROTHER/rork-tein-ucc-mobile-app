const palette = {
  crimson: "#D31532",
  jade: "#1F8E5C",
  charcoal: "#0B0B0F",
  onyx: "#15161C",
  ivory: "#F8F5F0",
  amber: "#FFB703",
  ocean: "#2F6FED",
  slate: "#6B7085",
};

const Colors = {
  palette,
  gradients: {
    hero: ["#180202", palette.crimson, palette.jade],
    card: ["#1C1D24", "#121216"],
    emerald: [palette.jade, "#25C084"],
  },
  roles: {
    member: palette.crimson,
    verified: "#008CFF",
    volunteer: palette.jade,
    executive: palette.amber,
    alumni: palette.ocean,
  },
  ui: {
    background: "#FFFFFF",
    surface: "#F4F6F8",
    elevated: "#FFFFFF",
    border: "#E5E7EB",
    textPrimary: palette.charcoal,
    textSecondary: palette.slate,
    success: "#00C853",
    warning: palette.amber,
  },
};

export default Colors;
