"use client"

import { IoIosArrowForward } from "react-icons/io"
import { IoIosArrowBack } from "react-icons/io"
import axios from "axios"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import quranImage from "../../public/Quran.png"
import bismillahImage from "../../public/bismillah.png"
import ayahIcon from "../../public/ayah-icon.svg"
import Button from "./UI/Button"
import Link from "next/link"
import Loading from "./UI/Loading"
import { useAppDispatch, useAppSelector } from "@/app/rtk/hooks"
import { addSurah, removeSurah, updateSurahsListLS } from "@/app/rtk/slices/listSlice"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { MdTranslate } from "react-icons/md"

interface AyahType {
  number: number
  text: string
  audio: string
  englishText?: string
  urduText?: string
  englishAudio?: string
  urduAudio?: string
}

interface SurahType {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  ayahs: AyahType[]
}

const ReadCom = () => {
  const pathname = usePathname()
  const surahNumber = Number(pathname.split("/")[pathname.split("/").length - 1])

  const [surah, setSurah] = useState<SurahType | null>(null)
  const [currentAyah, setCurrentAyah] = useState<AyahType | null>(null)
  const [currentAyahNumber, setCurrentAyahNumber] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState<"arabic" | "english" | "urdu">("arabic")
  const [showTranslations, setShowTranslations] = useState(false)

  const surahTextContainerRef = useRef<HTMLDivElement | null>(null)

  const [isSurahInList, setIsSurahInList] = useState<boolean | null>(null)

  const state = useAppSelector((state) => state.listSlice)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setTimeout(() => {
      const ayahIsActive: HTMLElement | null | undefined = surahTextContainerRef.current?.querySelector(".active")

      if (ayahIsActive?.offsetTop != null && surahTextContainerRef.current != null) {
        const scrollLimit = ayahIsActive?.offsetTop - surahTextContainerRef.current?.offsetHeight - 200
        const scrollInterval = setInterval(() => {
          if (surahTextContainerRef.current != null && surahTextContainerRef.current.scrollTop <= scrollLimit) {
            surahTextContainerRef.current.scrollTop = surahTextContainerRef.current.scrollTop += 50
          } else {
            clearInterval(scrollInterval)
          }
        }, 1)
      }
    }, 1000)
  }, [])

  const fetchSurah = useCallback(async () => {
    try {
      // Fetch Arabic text and audio
      const arabicResp = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`)

      // Fetch English translation and audio
      const englishResp = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`)

      // Fetch Urdu translation and audio
      const urduResp = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/ur.jalandhry`)

      // Combine the data
      const combinedAyahs = arabicResp.data.data.ayahs.map((ayah: AyahType, index: number) => ({
        ...ayah,
        englishText: englishResp.data.data.ayahs[index].text,
        urduText: urduResp.data.data.ayahs[index].text,
        englishAudio: englishResp.data.data.ayahs[index].audio,
        urduAudio: urduResp.data.data.ayahs[index].audio,
      }))

      const surahData = {
        ...arabicResp.data.data,
        ayahs: combinedAyahs,
      }

      setSurah(surahData)
      setCurrentAyahNumber(surahData.ayahs[0].number)
      setCurrentAyah(surahData.ayahs[0])

      const lastAyahFromLS = localStorage.getItem("lastAyah")
      if (lastAyahFromLS != null) {
        setLastAyah()
      }
    } catch (err) {
      console.log(err)
    }
  }, [surahNumber])

  useEffect(() => {
    fetchSurah()
  }, [fetchSurah])

  useEffect(() => {
    const lastAyahFromLS = localStorage.getItem("lastAyah")

    if (currentAyah) {
      if (lastAyahFromLS !== null) {
        const lastAyahObjFromLS = JSON.parse(lastAyahFromLS)

        lastAyahObjFromLS.map((item: { surahNumber: number; ayah: AyahType }) => {
          const isDuplicated = lastAyahObjFromLS.find(
            (item: { surahNumber: number; ayah: AyahType }) => item.surahNumber == surahNumber,
          )

          if (item.surahNumber == surahNumber) {
            item.ayah = currentAyah

            localStorage.setItem("lastAyah", JSON.stringify(lastAyahObjFromLS))
          } else if (item.surahNumber != surahNumber && !isDuplicated) {
            localStorage.setItem(
              "lastAyah",
              JSON.stringify(lastAyahObjFromLS.concat({ surahNumber, ayah: currentAyah })),
            )
          }
        })
      } else {
        localStorage.setItem(
          "lastAyah",
          JSON.stringify([
            {
              surahNumber: surah?.number,
              ayah: currentAyah,
            },
          ]),
        )
      }
    }
  }, [currentAyah])

  const setLastAyah = () => {
    const lastAyahFromLS = localStorage.getItem("lastAyah")

    if (lastAyahFromLS != null) {
      const lastAyahObjFromLS = JSON.parse(lastAyahFromLS)

      lastAyahObjFromLS.map((item: { ayah: AyahType; surahNumber: number }) => {
        if (item.surahNumber == surahNumber) {
          setCurrentAyah(item.ayah)
          setCurrentAyahNumber(item.ayah.number)
        }
      })
    }
  }

  const checkIfSurahInTheList = useCallback((): boolean => {
    const isDuplicated = false

    return isDuplicated
  }, [state.list, surahNumber])

  useEffect(() => {
    setIsSurahInList(checkIfSurahInTheList())
  }, [checkIfSurahInTheList])

  const handleAddToList = (surah: any) => {
    dispatch(addSurah(surah))
    dispatch(updateSurahsListLS())
  }

  const handleRemoveFromList = (surah: any) => {
    dispatch(removeSurah(surah))
    dispatch(updateSurahsListLS())
  }
  const getAudioSource = () => {
    if (!currentAyah) return ""
    switch (selectedLanguage) {
      case "english":
        return currentAyah.englishAudio || ""
      case "urdu":
        return currentAyah.urduAudio || ""
      default:
        return currentAyah.audio
    }
  }

  const getAyahText = (ayah: AyahType) => {
    switch (selectedLanguage) {
      case "english":
        return ayah.englishText
      case "urdu":
        return ayah.urduText
      default:
        return ayah.text
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 lg:py-14 lg:px-4 max-w-7xl">
      {surah ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-l from-primary-color-5 to-primary-color w-full mx-auto text-white p-6 rounded-t-md">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">
                  {surah?.name} - {surah?.englishName}
                </h2>
                <p className="text-xl">{surah?.englishNameTranslation}</p>
                <p className="text-lg text-gray-200">{surah?.numberOfAyahs} Ayahs</p>
              </div>
              <div className="hidden md:block">
                <Image
                  src={quranImage || "/placeholder.svg"}
                  alt="Quran"
                  quality={100}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-b-lg">
            {/* Surah Info Bar */}
            <div className="flex items-center justify-between p-4 text-primary-gray border-b">
              <h3 className="text-lg font-semibold truncate flex-1">{surah.englishName}</h3>
              <div className="text-center flex-1">
                <h5 className="text-lg font-semibold">{surah.name}</h5>
                <h5 className="text-sm">{surah.englishNameTranslation}</h5>
              </div>
              <h3 className="text-lg font-semibold text-end flex-1">Ayah {currentAyahNumber}</h3>
            </div>

            {/* Language Selection */}
            <div className="flex flex-wrap justify-center gap-3 my-4 px-4">
              <Button
                text="Arabic"
                customStyles={`${selectedLanguage === "arabic" ? "bg-primary-color text-white" : "bg-white text-primary-color border border-primary-color"} px-4 py-2 rounded-full`}
                onclick={() => setSelectedLanguage("arabic")}
              />
              <Button
                text="English"
                customStyles={`${selectedLanguage === "english" ? "bg-primary-color text-white" : "bg-white text-primary-color border border-primary-color"} px-4 py-2 rounded-full`}
                onclick={() => setSelectedLanguage("english")}
              />
              <Button
                text="Urdu"
                customStyles={`${selectedLanguage === "urdu" ? "bg-primary-color text-white" : "bg-white text-primary-color border border-primary-color"} px-4 py-2 rounded-full`}
                onclick={() => setSelectedLanguage("urdu")}
              />
              <Button
                text=""
                icon={<MdTranslate size={20} />}
                customStyles={`bg-white text-primary-color border border-primary-color px-4 py-2 rounded-full ${showTranslations ? "bg-primary-color-5 text-white" : ""}`}
                onclick={() => setShowTranslations(!showTranslations)}
              />
            </div>

            {/* Bismillah Image */}
            <div className="w-full my-6 text-center">
              <Image
                src={bismillahImage || "/placeholder.svg"}
                alt="Bismillah"
                quality={100}
                width={200}
                height={80}
                className="mx-auto"
              />
            </div>

            {/* Ayahs Container */}
            <div
              ref={surahTextContainerRef}
              className="min-h-[20rem] max-h-[35rem] overflow-y-auto bg-gradient-to-t from-primary-color-6 rounded-lg shadow-inner px-2 md:px-4"
              dir={selectedLanguage === "arabic" ? "rtl" : "ltr"}
            >
              {surah.ayahs?.map((ayah: AyahType) => (
                <div className="py-4 px-2 border-b border-gray-200 last:border-b-0" key={ayah.number}>
                  <div className="flex items-start gap-3 max-w-4xl mx-auto">
                    <div className="relative min-w-[40px] h-[40px] mt-1">
                      <span className="absolute text-sm font-bold top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                        {ayah.number}
                      </span>
                      <Image
                        src={ayahIcon || "/placeholder.svg"}
                        alt="Ayah number"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h1
                        className={`text-xl md:text-2xl leading-relaxed whitespace-normal break-words ${
                          selectedLanguage === "arabic" ? "amiri-family text-right" : ""
                        } ${
                          currentAyahNumber === ayah.number
                            ? "text-primary-color font-bold active"
                            : "text-primary-gray"
                        } hover:text-primary-color cursor-pointer`}
                        onClick={() => {
                          setCurrentAyahNumber(ayah.number)
                          setCurrentAyah(ayah)
                        }}
                      >
                        {getAyahText(ayah)}
                      </h1>

                      {showTranslations && (
                        <div className="flex flex-col gap-4 text-base mt-4">
                          {selectedLanguage !== "arabic" && (
                            <p className="text-primary-gray-600 leading-relaxed whitespace-normal break-words text-right amiri-family">
                              {ayah.text}
                            </p>
                          )}
                          {selectedLanguage !== "english" && (
                            <p className="text-primary-gray-600 leading-relaxed whitespace-normal break-words">
                              {ayah.englishText}
                            </p>
                          )}
                          {selectedLanguage !== "urdu" && (
                            <p className="text-primary-gray-600 leading-relaxed whitespace-normal break-words">
                              {ayah.urduText}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls Section */}
            <div className="bg-gradient-to-r from-primary-color-5 to-primary-color rounded-b-md p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 order-2 md:order-1">
                  <Link href={surahNumber <= 1 ? "/" : `/read/surah/${surahNumber - 1}`}>
                    <Button
                      text="Previous"
                      icon={<IoIosArrowBack />}
                      customStyles="bg-white !text-primary-color border px-4 py-2 rounded-full hover:bg-gray-100"
                    />
                  </Link>
                  <Link href={surahNumber >= 114 ? "/" : `/read/surah/${surahNumber + 1}`}>
                    <Button
                      text="Next"
                      icon={<IoIosArrowForward />}
                      customStyles="bg-white !text-primary-color border px-4 py-2 flex-row-reverse rounded-full hover:bg-gray-100"
                    />
                  </Link>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto order-1 md:order-2">
                  <audio className="w-full md:w-[300px] h-[45px] rounded" src={getAudioSource()} controls />
                  <Button
                    text=""
                    icon={
                      isSurahInList ? <AiFillHeart size={24} className="text-red-500" /> : <AiOutlineHeart size={24} />
                    }
                    customStyles="!text-primary-color bg-white p-2 rounded-full hover:bg-gray-100"
                    onclick={() => (isSurahInList ? handleRemoveFromList(surah) : handleAddToList(surah))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading />
        </div>
      )}
    </div>
  )
}

export default ReadCom
