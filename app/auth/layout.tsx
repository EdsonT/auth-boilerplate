import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "../providers";
import { Link } from "@nextui-org/react";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/favicon.ico",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<Toaster
					position="top-right"
					containerClassName=""
					toastOptions={{
						className: "dark:bg-default-200 dark:text-slate-400",
						duration: 5000,
					}}
				/>
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<main className="container mx-auto  flex-grow">
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
