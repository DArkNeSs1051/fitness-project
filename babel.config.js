module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    plugins: [
      "nativewind/babel",
      "expo-router/babel", // Added expo-router plugin
      "react-native-reanimated/plugin", // Keep this last
    ],
  };
};