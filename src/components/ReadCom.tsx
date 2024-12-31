

// "use client";

// import { IoIosArrowForward } from "react-icons/io";
// import { IoIosArrowBack } from "react-icons/io";
// import axios from "axios";
// import { usePathname } from "next/navigation";
// import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import quranImage from "../../public/Quran.png";
// import bismillahImage from "../../public/bismillah.png";
// import ayahIcon from "../../public/ayah-icon.svg";
// import Button from "./UI/Button";
// import Link from "next/link";
// import Loading from "./UI/Loading";
// import { useAppDispatch, useAppSelector } from "@/app/rtk/hooks";
// import { addSurah, removeSurah, updateSurahsListLS } from "@/app/rtk/slices/listSlice";
// import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
// import { MdTranslate, MdVolumeUp } from "react-icons/md";

// interface AyahType {
//   number: number;
//   text: string;
//   audio: string;
//   englishText?: string;
//   urduText?: string;
//   englishAudio?: string;
//   urduAudio?: string;
// }

// interface SurahType {
//   number: number;
//   name: string;
//   englishName: string;
//   englishNameTranslation: string;
//   numberOfAyahs: number;
//   ayahs: AyahType[];
// }

// const ReadCom = () => {
//   const pathname = usePathname();
//   let surahNumber = Number(pathname.split("/")[pathname.split("/").length - 1]);

//   const [surah, setSurah] = useState<SurahType | null>(null);
//   const [currentAyah, setCurrentAyah] = useState<AyahType | null>(null);
//   const [currentAyahNumber, setCurrentAyahNumber] = useState(1);
//   const [selectedLanguage, setSelectedLanguage] = useState<'arabic' | 'english' | 'urdu'>('arabic');
//   const [showTranslations, setShowTranslations] = useState(false);

//   let surahTextContainerRef = useRef<HTMLDivElement | null>(null);

//   const [isSurahInList, setIsSurahInList] = useState<boolean | null>(null);

//   const state = useAppSelector(state => state.listSlice);
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     setTimeout(() => {
//       const ayahIsActive: HTMLElement | null | undefined =
//         surahTextContainerRef.current?.querySelector(".active");

//       if (ayahIsActive?.offsetTop != null && surahTextContainerRef.current != null) {
//         let scrollLimit = ayahIsActive?.offsetTop - surahTextContainerRef.current?.offsetHeight - 200;
//         const scrollInterval = setInterval(() => {
//           if (surahTextContainerRef.current != null && surahTextContainerRef.current.scrollTop <= scrollLimit) {
//             surahTextContainerRef.current.scrollTop = surahTextContainerRef.current.scrollTop += 50;
//           } else {
//             clearInterval(scrollInterval);
//           }
//         }, 1);
//       }
//     }, 1000);
//   }, []);

//   const fetchSurah = useCallback(async () => {
// 	try {
// 	  // Fetch Arabic text and audio
// 	  const arabicResp = await axios.get(
// 		`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`
// 	  );
	  
// 	  // Fetch English translation and audio
// 	  const englishResp = await axios.get(
// 		`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`
// 	  );
  
// 	  // Fetch Urdu translation and audio
// 	  const urduResp = await axios.get(
// 		`https://api.alquran.cloud/v1/surah/${surahNumber}/ur.jalandhry`
// 	  );
  
// 	  // Combine the data
// 	  const combinedAyahs = arabicResp.data.data.ayahs.map((ayah: AyahType, index: number) => ({
// 		...ayah,
// 		englishText: englishResp.data.data.ayahs[index].text,
// 		urduText: urduResp.data.data.ayahs[index].text,
// 		englishAudio: englishResp.data.data.ayahs[index].audio,
// 		urduAudio: urduResp.data.data.ayahs[index].audio,
// 	  }));
  
// 	  const surahData = {
// 		...arabicResp.data.data,
// 		ayahs: combinedAyahs,
// 	  };
  
// 	  setSurah(surahData);
// 	  setCurrentAyahNumber(surahData.ayahs[0].number);
// 	  setCurrentAyah(surahData.ayahs[0]);
	  
// 	  const lastAyahFromLS = localStorage.getItem("lastAyah");
// 	  if (lastAyahFromLS != null) {
// 		setLastAyah();
// 	  }
// 	} catch (err) {
// 	  console.log(err);
// 	}
//   }, [surahNumber]);
  

//   useEffect(() => {
//     fetchSurah();
//   }, [fetchSurah]);

//  	useEffect(() => {
// 		const lastAyahFromLS = localStorage.getItem("lastAyah");

// 		if (currentAyah) {
// 			if (lastAyahFromLS !== null) {
// 				const lastAyahObjFromLS = JSON.parse(lastAyahFromLS);

// 				lastAyahObjFromLS.map(
// 					(item: { surahNumber: number; ayah: AyahType }) => {
// 						const isDuplicated = lastAyahObjFromLS.find(
// 							(item: { surahNumber: number; ayah: AyahType }) =>
// 								item.surahNumber == surahNumber
// 						);

// 						if (item.surahNumber == surahNumber) {
// 							item.ayah = currentAyah;

// 							localStorage.setItem(
// 								"lastAyah",
// 								JSON.stringify(lastAyahObjFromLS)
// 							);
// 						} else if (item.surahNumber != surahNumber && !isDuplicated) {
// 							localStorage.setItem(
// 								"lastAyah",
// 								JSON.stringify(
// 									lastAyahObjFromLS.concat({ surahNumber, ayah: currentAyah })
// 								)
// 							);
// 						}
// 					}
// 				);
// 			} else {
// 				localStorage.setItem(
// 					"lastAyah",
// 					JSON.stringify([
// 						{
// 							surahNumber: surah?.number,
// 							ayah: currentAyah,
// 						},
// 					])
// 				);
// 			}
// 		}
// 	}, [currentAyah]);

// 	const setLastAyah = () => {
// 		const lastAyahFromLS = localStorage.getItem("lastAyah");

// 		if (lastAyahFromLS != null) {
// 			const lastAyahObjFromLS = JSON.parse(lastAyahFromLS);

// 			lastAyahObjFromLS.map((item: { ayah: AyahType; surahNumber: number }) => {
// 				if (item.surahNumber == surahNumber) {
// 					setCurrentAyah(item.ayah);
// 					setCurrentAyahNumber(item.ayah.number);
// 				}
// 			});
// 		}
// 	};

// 	const checkIfSurahInTheList = useCallback((): boolean => {
// 		let isDuplicated = false;

		

// 		return isDuplicated;
// 	}, [state.list, surahNumber]);

// 	useEffect(() => {
// 		setIsSurahInList(checkIfSurahInTheList());
// 	}, [checkIfSurahInTheList]);

// 	const handleAddToList = (surah: any) => {
// 		dispatch(addSurah(surah));
// 		dispatch(updateSurahsListLS());
// 	};

// 	const handleRemoveFromList = (surah: any) => {
// 		dispatch(removeSurah(surah));
// 		dispatch(updateSurahsListLS());
// 	};
// 	const getAudioSource = () => {
// 		if (!currentAyah) return '';
// 		switch (selectedLanguage) {
// 		  case 'english':
// 			return currentAyah.englishAudio || '';
// 		  case 'urdu':
// 			return currentAyah.urduAudio || '';
// 		  default:
// 			return currentAyah.audio;
// 		}
// 	  };
	  

//   const getAyahText = (ayah: AyahType) => {
//     switch (selectedLanguage) {
//       case 'english':
//         return ayah.englishText;
//       case 'urdu':
//         return ayah.urduText;
//       default:
//         return ayah.text;
//     }
//   };

//   return (
//     <div className="container grid items-center h-full mx-auto lg:px-4 lg:py-14">
//       {surah ? (
//         <>
//           <div className="">
//             <div className="flex justify-between items-center bg-gradient-to-l from-primary-color-5 to-primary-color max-w-[70rem] w-full h-40 mx-auto text-white p-4 rounded-t-md">
//               <div className="p-3">
//                 <h2 className="text-2xl font-semibold">
//                   {surah?.name} - {surah?.englishName}
//                 </h2>
//                 <p className="mb-2 text-xl">{surah?.englishNameTranslation}</p>
//                 <p className="text-lg !text-gray-200">{surah?.numberOfAyahs} Ayahs</p>
//               </div>
//               <div>
//                 <Image
//                   src={quranImage}
//                   alt="quranImage"
//                   quality={100}
//                   width={300}
//                   height={300}
//                   className="hidden mb-8 md:block"
//                 />
//               </div>
//             </div>
//             <div className="max-w-[70rem] mx-auto bg-slate-50 rounded-bl-lg rounded-br-lg">
//               <div className="flex items-center justify-between p-4 text-primary-gray">
//                 <h3 className="w-full text-xl font-semibold">
//                   {surah.englishName}
//                 </h3>
//                 <div className="w-full text-center">
//                   <h5 className="text-lg font-semibold">{surah.name}</h5>
//                   <h5>{surah.englishNameTranslation}</h5>
//                 </div>
//                 <h3 className="w-full text-xl font-semibold text-end">
//                   Ayah {currentAyahNumber}
//                 </h3>
//               </div>

//               {/* Language Selection */}
//               <div className="flex justify-center gap-4 mb-4">
//                 <Button
//                   text="Arabic"
//                   customStyles={`${selectedLanguage === 'arabic' ? 'bg-primary-color text-white' : 'bg-white text-primary-color'} px-4 py-2`}
//                   onclick={() => setSelectedLanguage('arabic')}
//                 />
//                 <Button
//                   text="English"
//                   customStyles={`${selectedLanguage === 'english' ? 'bg-primary-color text-white' : 'bg-white text-primary-color'} px-4 py-2`}
//                   onclick={() => setSelectedLanguage('english')}
//                 />
//                 <Button
//                   text="Urdu"
//                   customStyles={`${selectedLanguage === 'urdu' ? 'bg-primary-color text-white' : 'bg-white text-primary-color'} px-4 py-2`}
//                   onclick={() => setSelectedLanguage('urdu')}
//                 />
//                 <Button
// 			text=""
//                   icon={<MdTranslate size={24} />}
//                   customStyles="bg-white text-primary-color px-4 py-2"
//                   onclick={() => setShowTranslations(!showTranslations)}
//                 />
//               </div>

//               <div className="w-full mt-8">
//                 <Image
//                   src={bismillahImage}
//                   alt="bismillahImage"
//                   quality={100}
//                   width={150}
//                   height={150}
//                   className="mx-auto"
//                 />
//               </div>

//               <div
//                 ref={surahTextContainerRef}
//                 className="min-h-[20rem] max-h-[35rem] h-full text-2xl text-center font-semibold text-primary-gray mt-8 overflow-y-scroll bg-gradient-to-t from-primary-color-6"
//                 dir={selectedLanguage === 'arabic' ? 'rtl' : 'ltr'}
//               >
//                 {surah.ayahs?.map((ayah: AyahType) => (
//                   <div
//                     className="flex flex-col items-center justify-center gap-3 p-3"
//                     key={ayah.number}
//                   >
//                     <div className="flex items-center gap-3">
//                       <h1
//                         className={`text-xl md:text-2xl ${selectedLanguage === 'arabic' ? 'amiri-family' : ''} ${
//                           currentAyahNumber == ayah.number && "text-primary-color active"
//                         } hover:text-primary-color cursor-pointer`}
//                         onClick={() => {
//                           setCurrentAyahNumber(ayah.number);
//                           setCurrentAyah(ayah);
//                         }}
//                       >
//                         {getAyahText(ayah)}
//                       </h1>
//                       <div className="relative min-w-[50px] h-[50px] inline-block">
//                         <span className="absolute text-sm font-bold top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4">
//                           {ayah.number}
//                         </span>
//                         <Image src={ayahIcon} alt="ayahIcon" width={50} height={50} />
//                       </div>
//                     </div>

//                     {showTranslations && (
//                       <div className="flex flex-col gap-2 text-lg">
//                         {selectedLanguage !== 'arabic' && (
//                           <p className="text-primary-gray-600">{ayah.text}</p>
//                         )}
//                         {selectedLanguage !== 'english' && (
//                           <p className="text-primary-gray-600">{ayah.englishText}</p>
//                         )}
//                         {selectedLanguage !== 'urdu' && (
//                           <p className="text-primary-gray-600">{ayah.urduText}</p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div className="relative flex flex-col-reverse items-center justify-between gap-4 p-4 mb-4 border-t-2 md:flex-row lg:mb-0 md:gap-12 bg-gradient-to-r from-primary-color-5 to-primary-color rounded-b-md">
//                 <div className="flex items-center gap-2 w-fit">
//                   <Link href={surahNumber <= 1 ? "/" : `/read/surah/${surahNumber - 1}`}>
//                     <Button
//                       text="Prev"
//                       icon={<IoIosArrowBack />}
//                       customStyles="bg-white !text-primary-color border px-4 py-2"
//                     />
//                   </Link>
//                   <Link href={surahNumber >= 114 ? "/" : `/read/surah/${surahNumber + 1}`}>
//                     <Button
//                       text="Next"
//                       icon={<IoIosArrowForward />}
//                       customStyles="bg-white !text-primary-color border px-4 py-2 flex-row-reverse"
//                     />
//                   </Link>
//                 </div>
//                 <div className="w-full h-[45px] flex items-center gap-2">
//                   <audio
//                     className="w-full h-full min-h-[45px]"
//                     src={getAudioSource()}
//                     controls
//                   />

//                   <Button
//                     text=""
//                     icon={isSurahInList ? (
//                       <AiFillHeart size={28} className="text-primary-color" />
//                     ) : (
//                       <AiOutlineHeart size={28} />
//                     )}
//                     customStyles="!text-primary-color bg-white"
//                     onclick={() =>
//                       isSurahInList ? handleRemoveFromList(surah) : handleAddToList(surah)
//                     }
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         <Loading />
//       )}
//     </div>
//   );
// };

// export default ReadCom;
"use client";

import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import { usePathname } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import quranImage from "../../public/Quran.png";
import bismillahImage from "../../public/bismillah.png";
import ayahIcon from "../../public/ayah-icon.svg";
import Button from "./UI/Button";
import Link from "next/link";
import Loading from "./UI/Loading";
import { useAppDispatch, useAppSelector } from "@/app/rtk/hooks";
import { addSurah, removeSurah, updateSurahsListLS } from "@/app/rtk/slices/listSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdTranslate, MdVolumeUp } from "react-icons/md";
interface AyahType {
  number: number;
  text: string;
  audio: string;
  englishText?: string;
  urduText?: string;
  englishAudio?: string;
  urduAudio?: string;
}

interface SurahType {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  ayahs: AyahType[];
}

const ReadCom = () => {
  const pathname = usePathname();
  let surahNumber = Number(pathname.split("/")[pathname.split("/").length - 1]);

  const [surah, setSurah] = useState<SurahType | null>(null);
  const [currentAyah, setCurrentAyah] = useState<AyahType | null>(null);
  const [currentAyahNumber, setCurrentAyahNumber] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<'arabic' | 'english' | 'urdu'>('arabic');
  const [showTranslations, setShowTranslations] = useState(false);

  let surahTextContainerRef = useRef<HTMLDivElement | null>(null);

  const [isSurahInList, setIsSurahInList] = useState<boolean | null>(null);

  const state = useAppSelector(state => state.listSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(() => {
      const ayahIsActive: HTMLElement | null | undefined =
        surahTextContainerRef.current?.querySelector(".active");

      if (ayahIsActive?.offsetTop != null && surahTextContainerRef.current != null) {
        let scrollLimit = ayahIsActive?.offsetTop - surahTextContainerRef.current?.offsetHeight - 200;
        const scrollInterval = setInterval(() => {
          if (surahTextContainerRef.current != null && surahTextContainerRef.current.scrollTop <= scrollLimit) {
            surahTextContainerRef.current.scrollTop = surahTextContainerRef.current.scrollTop += 50;
          } else {
            clearInterval(scrollInterval);
          }
        }, 1);
      }
    }, 1000);
  }, []);

  const fetchSurah = useCallback(async () => {
	try {
	  // Fetch Arabic text and audio
	  const arabicResp = await axios.get(
		`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`
	  );
	  
	  // Fetch English translation and audio
	  const englishResp = await axios.get(
		`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`
	  );
  
	  // Fetch Urdu translation and audio
	  const urduResp = await axios.get(
		`https://api.alquran.cloud/v1/surah/${surahNumber}/ur.jalandhry`
	  );
  
	  // Combine the data
	  const combinedAyahs = arabicResp.data.data.ayahs.map((ayah: AyahType, index: number) => ({
		...ayah,
		englishText: englishResp.data.data.ayahs[index].text,
		urduText: urduResp.data.data.ayahs[index].text,
		englishAudio: englishResp.data.data.ayahs[index].audio,
		urduAudio: urduResp.data.data.ayahs[index].audio,
	  }));
  
	  const surahData = {
		...arabicResp.data.data,
		ayahs: combinedAyahs,
	  };
  
	  setSurah(surahData);
	  setCurrentAyahNumber(surahData.ayahs[0].number);
	  setCurrentAyah(surahData.ayahs[0]);
	  
	  const lastAyahFromLS = localStorage.getItem("lastAyah");
	  if (lastAyahFromLS != null) {
		setLastAyah();
	  }
	} catch (err) {
	  console.log(err);
	}
  }, [surahNumber]);
  

  useEffect(() => {
    fetchSurah();
  }, [fetchSurah]);

 	useEffect(() => {
		const lastAyahFromLS = localStorage.getItem("lastAyah");

		if (currentAyah) {
			if (lastAyahFromLS !== null) {
				const lastAyahObjFromLS = JSON.parse(lastAyahFromLS);

				lastAyahObjFromLS.map(
					(item: { surahNumber: number; ayah: AyahType }) => {
						const isDuplicated = lastAyahObjFromLS.find(
							(item: { surahNumber: number; ayah: AyahType }) =>
								item.surahNumber == surahNumber
						);

						if (item.surahNumber == surahNumber) {
							item.ayah = currentAyah;

							localStorage.setItem(
								"lastAyah",
								JSON.stringify(lastAyahObjFromLS)
							);
						} else if (item.surahNumber != surahNumber && !isDuplicated) {
							localStorage.setItem(
								"lastAyah",
								JSON.stringify(
									lastAyahObjFromLS.concat({ surahNumber, ayah: currentAyah })
								)
							);
						}
					}
				);
			} else {
				localStorage.setItem(
					"lastAyah",
					JSON.stringify([
						{
							surahNumber: surah?.number,
							ayah: currentAyah,
						},
					])
				);
			}
		}
	}, [currentAyah]);

	const setLastAyah = () => {
		const lastAyahFromLS = localStorage.getItem("lastAyah");

		if (lastAyahFromLS != null) {
			const lastAyahObjFromLS = JSON.parse(lastAyahFromLS);

			lastAyahObjFromLS.map((item: { ayah: AyahType; surahNumber: number }) => {
				if (item.surahNumber == surahNumber) {
					setCurrentAyah(item.ayah);
					setCurrentAyahNumber(item.ayah.number);
				}
			});
		}
	};

	const checkIfSurahInTheList = useCallback((): boolean => {
		let isDuplicated = false;

   

		return isDuplicated;
	}, [state.list, surahNumber]);

	useEffect(() => {
		setIsSurahInList(checkIfSurahInTheList());
	}, [checkIfSurahInTheList]);

	const handleAddToList = (surah: any) => {
		dispatch(addSurah(surah));
		dispatch(updateSurahsListLS());
	};

	const handleRemoveFromList = (surah: any) => {
		dispatch(removeSurah(surah));
		dispatch(updateSurahsListLS());
	};
	const getAudioSource = () => {
		if (!currentAyah) return '';
		switch (selectedLanguage) {
		  case 'english':
			return currentAyah.englishAudio || '';
		  case 'urdu':
			return currentAyah.urduAudio || '';
		  default:
			return currentAyah.audio;
		}
	  };
	  

  const getAyahText = (ayah: AyahType) => {
    switch (selectedLanguage) {
      case 'english':
        return ayah.englishText;
      case 'urdu':
        return ayah.urduText;
      default:
        return ayah.text;
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <div className="container flex flex-col flex-grow px-4 py-6 mx-auto">
        {surah ? (
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="p-6 text-white bg-gradient-to-l from-primary-color-5 to-primary-color rounded-t-md">
              <div className="flex items-center justify-between mx-auto max-w-7xl">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold md:text-3xl">
                    {surah?.name} - {surah?.englishName}
                  </h2>
                  <p className="text-lg md:text-xl">{surah?.englishNameTranslation}</p>
                  <p className="text-base text-gray-200 md:text-lg">{surah?.numberOfAyahs} Ayahs</p>
                </div>
                <Image
                  src={quranImage}
                  alt="quranImage"
                  quality={100}
                  width={200}
                  height={200}
                  className="hidden md:block"
                />
              </div>
            </div>

            {/* Main Content Section */}
            <div className="flex flex-col flex-grow bg-slate-50 rounded-b-md">
              {/* Surah Info */}
              <div className="grid grid-cols-3 p-4 border-b text-primary-gray">
                <h3 className="text-lg font-semibold md:text-xl">{surah.englishName}</h3>
                <div className="text-center">
                  <h5 className="text-lg font-semibold">{surah.name}</h5>
                  <h5>{surah.englishNameTranslation}</h5>
                </div>
                <h3 className="text-lg font-semibold md:text-xl text-end">
                  Ayah {currentAyahNumber}
                </h3>
              </div>

              {/* Language Selection */}
              <div className="flex flex-wrap justify-center gap-3 p-4">
                {['arabic', 'english', 'urdu'].map((lang) => (
                  <Button
                    key={lang}
                    text={lang.charAt(0).toUpperCase() + lang.slice(1)}
                    customStyles={`${
                      selectedLanguage === lang ? 'bg-primary-color text-white' : 'bg-white text-primary-color'
                    } px-4 py-2`}
                    onclick={() => setSelectedLanguage(lang as 'arabic' | 'english' | 'urdu')}
                  />
                ))}
                <Button
                  text=""
                  icon={<MdTranslate size={24} />}
                  customStyles="bg-white text-primary-color px-4 py-2"
                  onclick={() => setShowTranslations(!showTranslations)}
                />
              </div>

              {/* Bismillah Image */}
              <div className="w-full py-6">
                <Image
                  src={bismillahImage}
                  alt="bismillahImage"
                  quality={100}
                  width={150}
                  height={150}
                  className="mx-auto"
                />
              </div>

              {/* Ayahs Container */}
              <div
                ref={surahTextContainerRef}
                className="flex-grow overflow-y-auto bg-gradient-to-t from-primary-color-6"
                style={{ maxHeight: 'calc(100vh - 500px)', minHeight: '300px' }}
                dir={selectedLanguage === 'arabic' ? 'rtl' : 'ltr'}
              >
                {surah.ayahs?.map((ayah: AyahType) => (
                  <div
                    key={ayah.number}
                    className="flex flex-col items-center justify-center p-4 border-b"
                  >
                    <div className="flex items-center w-full max-w-4xl gap-4">
                      <div 
                        className={`flex-grow ${
                          selectedLanguage === 'arabic' ? 
                          'text-2xl md:text-3xl amiri-family leading-loose' : 
                          'text-xl md:text-2xl'
                        } ${
                          currentAyahNumber == ayah.number ? "text-primary-color active" : ""
                        } hover:text-primary-color cursor-pointer relative`}
                        onClick={() => {
                          setCurrentAyahNumber(ayah.number);
                          setCurrentAyah(ayah);
                        }}
                      >
                        {/* Line for Arabic text */}
                        {selectedLanguage === 'arabic' && (
                          <div 
                            className="absolute w-full"
                            style={{
                              borderBottom: '1px solid #023020',
                              top: '75%',
                              opacity: 0.3
                            }}
                          />
                        )}
                        {getAyahText(ayah)}
                      </div>
                      <div className="relative flex-shrink-0 w-[50px] h-[50px]">
                        <span className="absolute text-sm font-bold transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                          {ayah.number}
                        </span>
                        <Image src={ayahIcon} alt="ayahIcon" width={50} height={50} />
                      </div>
                    </div>

                    {showTranslations && (
                      <div className="flex flex-col w-full max-w-4xl gap-3 mt-4 text-lg">
                        {selectedLanguage !== 'arabic' && (
                          <p className="text-primary-gray-600">{ayah.text}</p>
                        )}
                        {selectedLanguage !== 'english' && (
                          <p className="text-primary-gray-600">{ayah.englishText}</p>
                        )}
                        {selectedLanguage !== 'urdu' && (
                          <p className="text-primary-gray-600">{ayah.urduText}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Controls Section */}
              <div className="sticky bottom-0 p-4 bg-gradient-to-r from-primary-color-5 to-primary-color rounded-b-md">
                <div className="flex flex-col items-center gap-4 mx-auto md:flex-row max-w-7xl">
                  <div className="flex items-center gap-2">
                    <Link href={surahNumber <= 1 ? "/" : `/read/surah/${surahNumber - 1}`}>
                      <Button
                        text="Prev"
                        icon={<IoIosArrowBack />}
                        customStyles="bg-white !text-primary-color border px-4 py-2"
                      />
                    </Link>
                    <Link href={surahNumber >= 114 ? "/" : `/read/surah/${surahNumber + 1}`}>
                      <Button
                        text="Next"
                        icon={<IoIosArrowForward />}
                        customStyles="bg-white !text-primary-color border px-4 py-2 flex-row-reverse"
                      />
                    </Link>
                  </div>
                  <div className="flex items-center flex-grow gap-2">
                    <audio
                      className="w-full"
                      src={getAudioSource()}
                      controls
                    />
                    <Button
                      text=""
                      icon={isSurahInList ? (
                        <AiFillHeart size={28} className="text-primary-color" />
                      ) : (
                        <AiOutlineHeart size={28} />
                      )}
                      customStyles="!text-primary-color bg-white"
                      onclick={() =>
                        isSurahInList ? handleRemoveFromList(surah) : handleAddToList(surah)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default ReadCom;
