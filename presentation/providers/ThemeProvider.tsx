"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// speech to text recognition для стабильной работы пихнул сюда
import "regenerator-runtime/runtime";

function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default ThemeProvider;
