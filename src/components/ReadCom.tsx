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
    <div className="container grid items-center h-full mx-auto lg:px-4 lg:py-14">
      {surah ? (
        <>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center bg-gradient-to-l from-primary-color-5 to-primary-color max-w-[70rem] w-full h-40 mx-auto text-white p-6 rounded-t-md">
              <div className="p-3">
                <h2 className="text-2xl font-semibold">
                  {surah?.name} - {surah?.englishName}
                </h2>
                <p className="mb-2 text-xl">{surah?.englishNameTranslation}</p>
                <p className="text-lg !text-gray-200">{surah?.numberOfAyahs} Ayahs</p>
              </div>
              <div>
                <Image
                  src={quranImage || "/placeholder.svg"}
                  alt="quranImage"
                  quality={100}
                  width={300}
                  height={300}
                  className="hidden mb-8 md:block"
                />
              </div>
            </div>
            <div className="max-w-[70rem] mx-auto bg-slate-50 rounded-bl-lg rounded-br-lg">
              <div className="flex items-center justify-between p-4 text-primary-gray">
                <h3 className="w-full text-xl font-semibold">{surah.englishName}</h3>
                <div className="w-full text-center">
                  <h5 className="text-lg font-semibold">{surah.name}</h5>
                  <h5>{surah.englishNameTranslation}</h5>
                </div>
                <h3 className="w-full text-xl font-semibold text-end">Ayah {currentAyahNumber}</h3>
              </div>

              {/* Language Selection */}
              <div className="flex justify-center gap-4 mb-4 mt-4">
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
                  icon={<MdTranslate size={24} />}
                  customStyles={`bg-white text-primary-color border border-primary-color px-4 py-2 rounded-full ${showTranslations ? "bg-primary-color-5 text-white" : ""}`}
                  onclick={() => setShowTranslations(!showTranslations)}
                />
              </div>

              <div className="w-full mt-8 mb-4 text-center">
                <Image
                  src={bismillahImage || "/placeholder.svg"}
                  alt="bismillahImage"
                  quality={100}
                  width={200}
                  height={80}
                  className="mx-auto"
                />
              </div>

              <div
                ref={surahTextContainerRef}
                className="min-h-[20rem] max-h-[35rem] h-full text-center font-semibold text-primary-gray mt-8 overflow-y-scroll bg-gradient-to-t from-primary-color-6 rounded-lg shadow-inner"
                dir={selectedLanguage === "arabic" ? "rtl" : "ltr"}
              >
                {surah.ayahs?.map((ayah: AyahType) => (
                  <div
                    className="flex flex-col items-center justify-center gap-3 p-4 border-b border-gray-200 last:border-b-0"
                    key={ayah.number}
                  >
                    <div className="flex items-center gap-3 w-full max-w-4xl">
                      <div className="relative min-w-[50px] h-[50px] inline-block">
                        <span className="absolute text-sm font-bold top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4">
                          {ayah.number}
                        </span>
                        <Image src={ayahIcon || "/placeholder.svg"} alt="ayahIcon" width={50} height={50} />
                      </div>
                      <h1
                        className={`text-xl md:text-2xl leading-loose ${selectedLanguage === "arabic" ? "amiri-family text-right" : ""} ${
                          currentAyahNumber == ayah.number && "text-primary-color font-bold active"
                        } hover:text-primary-color cursor-pointer`}
                        onClick={() => {
                          setCurrentAyahNumber(ayah.number)
                          setCurrentAyah(ayah)
                        }}
                      >
                        {getAyahText(ayah)}
                      </h1>
                    </div>

                    {showTranslations && (
                      <div className="flex flex-col gap-4 text-lg w-full max-w-4xl mt-2 px-4">
                        {selectedLanguage !== "arabic" && (
                          <p className="text-primary-gray-600 leading-relaxed text-right amiri-family">{ayah.text}</p>
                        )}
                        {selectedLanguage !== "english" && (
                          <p className="text-primary-gray-600 leading-relaxed">{ayah.englishText}</p>
                        )}
                        {selectedLanguage !== "urdu" && (
                          <p className="text-primary-gray-600 leading-relaxed">{ayah.urduText}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="relative flex flex-col-reverse items-center justify-between gap-4 p-4 mb-0 border-t md:flex-row md:gap-12 bg-gradient-to-r from-primary-color-5 to-primary-color rounded-b-md">
                <div className="flex items-center gap-2 w-fit">
                  <Link href={surahNumber <= 1 ? "/" : `/read/surah/${surahNumber - 1}`}>
                    <Button
                      text="Prev"
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
                <div className="w-full h-[45px] flex items-center gap-2">
                  <audio className="w-full h-full min-h-[45px] rounded" src={getAudioSource()} controls />

                  <Button
                    text=""
                    icon={
                      isSurahInList ? <AiFillHeart size={28} className="text-red-500" /> : <AiOutlineHeart size={28} />
                    }
                    customStyles="!text-primary-color bg-white rounded-full hover:bg-gray-100"
                    onclick={() => (isSurahInList ? handleRemoveFromList(surah) : handleAddToList(surah))}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ReadCom
