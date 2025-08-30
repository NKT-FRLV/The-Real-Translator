import React from "react";

type Props = {
  showLightBeam: boolean;
  placeholder: string;
  value: string;
};

const CustomPlaceholder: React.FC<Props> = ({ showLightBeam, placeholder, value }) => {
  // если есть текст — не рендерим вовсе
  if (value) return null;

  // Общие классы контейнера: абсолют, клики сквозь, плавное исчезновение,
  // скрываем при фокусе на peer-элементе (textarea) и/или на родителе-группе.
  const containerCls =
    "absolute inset-0 pointer-events-none flex items-start justify-start p-3 md:p-4 " +
    "transition-opacity duration-150 ease-in-out " +
    "peer-focus:opacity-0 group-focus-within:opacity-0";

  const textSize = value.length < 30
    ? "text-lg md:text-2xl lg:text-3xl"
    : "text-base md:text-lg lg:text-2xl";

  if (showLightBeam) {
    return (
      <div className={containerCls} aria-hidden="true">
        <div
          className={`relative inline-block h-full w-full ${textSize} font-medium text-foreground select-none shimmer-text`}
        >
          {placeholder}
        </div>
      </div>
    );
  }

  return (
    <div className={containerCls} aria-hidden="true">
      <div className={`${textSize} font-medium text-gray-500 select-none`}>
        {placeholder}
      </div>
    </div>
  );
};

export default CustomPlaceholder;
