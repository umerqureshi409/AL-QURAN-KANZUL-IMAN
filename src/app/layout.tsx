import Navbar from "@/components/Navbar/Navbar";
import "./globals.scss";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Providers } from "@/components/Provider";
import Alert from "@/components/UI/Alert";
export const metadata = {
	title: "Al - Quran",
	icons: {
		icon: [
			{ url: '/Quran.png' },
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: [
			{ url: '/Quran.png' },
		],
	},
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body>
				<section className="bg-white">
					<Navbar />
				</section>
				<main className="h-[calc(100%-70px)]">
					<section className="block h-full lg:flex">
						<Providers>
							<Sidebar />
							<div className="w-[calc(100%-32px)] lg:w-[calc(100vw-360px)] mx-auto">
								{children}
							</div>
						</Providers>
					</section>
				</main>
			</body>
		</html>
	);
}
