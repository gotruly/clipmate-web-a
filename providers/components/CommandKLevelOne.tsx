"use client";

import CommandKThemeGroup from "./CommandKThemeGroup";
import CommandKCollectionGroup from "./CommandKCollectionGroup";
import CommandKAddToCollectionGroup from "./CommandKAddToCollectionGroup";
import CommandKNavigationGroup from "./CommandKNavigationGroup";
import CommandKActionGroup from "./CommandKActionGroup";
import CommandKSettingsGroup from "./CommandKSettingsGroup";
import CommandKSourcesGroup from "./CommandKSourcesGroup";

export const CommandKLevelOne = () => {
  return (
    <>
      {/* Add to Collection Group */}
      <CommandKAddToCollectionGroup />

      {/* Navigation Group */}
      <CommandKNavigationGroup />

      {/* Sources Group */}
      <CommandKSourcesGroup />

      {/* Settings Group */}
      <CommandKSettingsGroup />

      {/* Action Group */}
      <CommandKActionGroup />

      {/* Collection Group */}
      <CommandKCollectionGroup />

      {/* Theme Group */}
      <CommandKThemeGroup />
    </>
  );
};

export default CommandKLevelOne;
