module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          // Project folders (context, navigation, screens, etc.) live at the
          // repository root, matching the TypeScript `@/*` path mapping.
          alias: { "@": "./" },
        },
      ],
    ],
  };
};
