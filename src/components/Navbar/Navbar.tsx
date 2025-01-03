// "use client";
// import { CgClose } from "react-icons/cg";
// import { CgMenuLeftAlt } from "react-icons/cg";
// import { FaQuran } from "react-icons/fa";
// import { AiOutlineSchedule } from "react-icons/ai";
// import { AiOutlineUnorderedList } from "react-icons/ai";
// import { AiOutlineRead } from "react-icons/ai";
// import { AiOutlineHome } from "react-icons/ai";
// import React, { useEffect, useRef, useState } from "react";
// import NavLink from "./NavLink";
// import Button from "../UI/Button";
// import { useMediaQuery } from "react-responsive";
// import Link from "next/link";

// const Navbar = () => {
// 	const [isMenuOpen, setIsMenuOpen] = useState(false);
// 	const [navLinksHeight, setNavLinksHeight] = useState(0);
// 	const linksRef = useRef<HTMLUListElement>(null);

// 	const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

// 	useEffect(() => {
// 		if (linksRef.current != undefined) {
// 			setNavLinksHeight(linksRef.current?.offsetHeight);
// 		}
// 	}, [linksRef.current?.offsetHeight]);

// 	return (
// 		<>
// 			<nav className="relative container mx-auto h-[70px] flex justify-between items-center rounded-md px-[1rem] md:px-[5rem] bg-white z-10">
// 			<Link href="/">
//     <Button 
//         text="Al - QURAN" 
//         icon={
//             <img 
//                 src="/Quran.png" 
//                 alt="Quran Icon" 
//                 style={{ width: 50, height: 50 }}
//             />
//         } 
//     />
// </Link>

// 				<Button
// 					text=""
// 					icon={
// 						isMenuOpen ? <CgClose size={25} /> : <CgMenuLeftAlt size={25} />
// 					}
// 					onclick={() => setIsMenuOpen(!isMenuOpen)}
// 					customStyles="visible md:hidden"
// 				/>
// 				<ul
// 					ref={linksRef}
// 					className={`items-center gap-4 ${
// 						isMenuOpen
// 							? `absolute w-full h-[${navLinksHeight}] left-0 top-[70px] flex-row [&>a]:w-full bg-white rounded-md z-0`
// 							: "hidden"
// 					} md:flex transition`}
// 				>
// 					<NavLink
// 						linkName="home"
// 						link="/"
// 						icon={<AiOutlineHome size={25} />}
// 					/>
// 					<NavLink
// 						linkName="list"
// 						link="list"
// 						icon={<AiOutlineUnorderedList size={25} />}
// 					/>
// 					<NavLink
// 						linkName="schedule"
// 						link="schedule"
// 						icon={<AiOutlineSchedule size={25} />}
// 					/>
// 				</ul>
// 			</nav>
// 		</>
// 	);
// };

// export default Navbar;
"use client";
import { CgClose } from "react-icons/cg";
import { CgMenuLeftAlt } from "react-icons/cg";
import { FaQuran } from "react-icons/fa";
import { AiOutlineSchedule } from "react-icons/ai";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { AiOutlineRead } from "react-icons/ai";
import { AiOutlineHome } from "react-icons/ai";
import React, { useEffect, useRef, useState } from "react";
import NavLink from "./NavLink";
import Button from "../UI/Button";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { FaCode } from "react-icons/fa";
import {  Bot, ReceiptText } from 'lucide-react';

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [navLinksHeight, setNavLinksHeight] = useState(0);
	const linksRef = useRef<HTMLUListElement>(null);

	const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

	useEffect(() => {
		if (linksRef.current != undefined) {
			setNavLinksHeight(linksRef.current?.offsetHeight);
		}
	}, [linksRef.current?.offsetHeight]);

	return (
		<>
			<nav className="relative container mx-auto h-[70px] flex justify-between items-center rounded-md px-[1rem] md:px-[5rem] bg-white z-10">
			<Link href="/">
    <Button 
        text="Al - QURAN" 
        icon={
            <img 
                src="/Quran.png" 
                alt="Quran Icon" 
                style={{ width: 50, height: 50 }}
            />
        } 
    />
</Link>

				<Button
					text=""
					icon={
						isMenuOpen ? <CgClose size={25} /> : <CgMenuLeftAlt size={25} />
					}
					onclick={() => setIsMenuOpen(!isMenuOpen)}
					customStyles="visible md:hidden"
				/>
				<ul
					ref={linksRef}
					className={`items-center gap-4 ${
						isMenuOpen
							? `absolute w-full h-[${navLinksHeight}] left-0 top-[70px] flex-row [&>a]:w-full bg-white rounded-md z-0`
							: "hidden"
					} md:flex transition`}
				>
					<NavLink
						linkName="home"
						link="/"
						icon={<AiOutlineHome size={25} />}
					/>
					<NavLink
						linkName="list"
						link="list"
						icon={<AiOutlineUnorderedList size={25} />}
					/>
{/* 					<NavLink
						linkName="ai"
						link="ai"
						icon={<Bot size={25} />}
					/> */}
					<NavLink
						linkName="schedule"
						link="schedule"
						icon={<AiOutlineSchedule size={25} />}
					/>
						<NavLink
						linkName="developers"
						link="developers"
						icon={<FaCode size={25} />}
					/>
					<NavLink
						linkName="terms"
						link="terms"
						icon={<ReceiptText size={25} />}
					/>
				
				</ul>
			</nav>
		</>
	);
};

export default Navbar;
