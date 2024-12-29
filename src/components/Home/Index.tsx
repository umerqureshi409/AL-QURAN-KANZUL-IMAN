"use client";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import SurahCard from "../UI/SurahCard";
import SortButton from "../UI/SortButton";
import Input from "../UI/Input";
import { useAppSelector } from "@/app/rtk/hooks";
import Loading from "../UI/Loading";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Al-Quran',
  icons: {
    icon: '/Quran.png',
  }
};

export interface AyahType {
  audio: string;
  audioSecondary: string[];
  hizbQuarter: number;
  juz: number;
  manzil: number;
  number: number;
  numberInSurah: number;
  page: number;
  ruku: number;
  sajda: boolean;
  text: string;
}

export interface SurahType {
  ayahs?: AyahType[];
  englishName: string;
  englishNameTranslation: string;
  name: string;
  number: number;
  numberOfAyahs: number;
  revelationType: string;
}

interface JuzType {
  number: number;
  surahs: {
    [key: string]: SurahType;
  };
}

const Home = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortBtnActive, setSortBtnActive] = useState("Number");
  const [surahsListOriginal, setSurahsListOriginal] = useState<SurahType[]>([]);
  const [surahsListToShow, setSurahsListToShow] = useState<SurahType[]>([]);
  const [juzData, setJuzData] = useState<JuzType[]>([]);
  const [searchResults, setSearchResults] = useState<SurahType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const surahsList = useAppSelector(state => state.listSlice.list);

  // Function to fetch Surah list
  const fetchSurahList = async () => {
    try {
      const response = await axios.get("https://api.alquran.cloud/v1/surah");
      const surahsData = response.data.data;
      setSurahsListOriginal(surahsData);
      setSurahsListToShow(surahsData);
      return surahsData;
    } catch (error) {
      console.error("Error fetching surah list:", error);
      return [];
    }
  };

  // Function to fetch Juz data
  const fetchJuzData = async () => {
    try {
      const juzPromises = Array.from({ length: 30 }, (_, i) =>
        axios.get(`https://api.alquran.cloud/v1/juz/${i + 1}`)
      );
      const responses = await Promise.all(juzPromises);
      const juzList = responses.map(res => res.data.data);
      setJuzData(juzList);
      return juzList;
    } catch (error) {
      console.error("Error fetching juz data:", error);
      return [];
    }
  };

  // Function to initialize data
  const initializeData = async () => {
    setIsLoading(true);
    const surahs = await fetchSurahList();
    if (sortBtnActive === "Para") {
      await fetchJuzData();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (sortBtnActive === "Para" && juzData.length === 0) {
      fetchJuzData();
    }
  }, [sortBtnActive]);

  // Function to handle number sorting
  const handleNumberSort = () => {
    const sorted = [...surahsListOriginal].sort((a, b) => a.number - b.number);
    setSurahsListToShow(sorted);
  };

  // Function to handle alphabet sorting
  const handleAlphabetSort = () => {
    const sorted = [...surahsListOriginal].sort((a, b) => 
      a.englishName.localeCompare(b.englishName)
    );
    setSurahsListToShow(sorted);
  };

  // Function to handle list sorting
  const handleListSort = () => {
    setSurahsListToShow(surahsList);
  };

  // Function to handle sort button selection
  const handleSelectedSortOption = useCallback(() => {
    switch (sortBtnActive) {
      case "Number":
        handleNumberSort();
        break;
      case "Alphabet":
        handleAlphabetSort();
        break;
      case "In List":
        handleListSort();
        break;
      case "Para":
        if (juzData.length === 0) {
          fetchJuzData();
        }
        break;
    }
  }, [sortBtnActive, surahsListOriginal, surahsList]);

  useEffect(() => {
    handleSelectedSortOption();
  }, [handleSelectedSortOption]);

  // Function to handle search
  useEffect(() => {
    const filteredResults = surahsListToShow.filter(surah => {
      if (!Number.isInteger(Number(searchValue))) {
        return surah.englishName.toLowerCase().includes(searchValue.toLowerCase());
      } else {
        return surah.number.toString().includes(searchValue);
      }
    });
    setSearchResults(filteredResults);
  }, [searchValue, surahsListToShow]);

  // Function to render Juz view
  const renderJuzView = () => {
    return (
      <div className="pr-3 space-y-8">
        {juzData.map((juz) => (
          <div key={juz.number} className="mb-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-100">
                Para {juz.number}
              </h2>
              {Object.values(juz.surahs)[0] && (
                <p className="text-sm text-gray-100">
                  Starts from: {Object.values(juz.surahs)[0].englishName}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {Object.values(juz.surahs).map((surah: SurahType) => (
                <SurahCard 
                  key={`${juz.number}-${surah.number}`} 
                  surah={surah}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to render normal view
  const renderNormalView = () => {
    const displayList = searchValue ? searchResults : surahsListToShow;

    if (displayList.length === 0 && searchValue) {
      return (
        <h2 className="text-center text-white">
          &quot;{searchValue}&quot; does not match any results!
        </h2>
      );
    }

    if (displayList.length === 0) {
      return <h2 className="py-6 text-center text-white" >No items!</h2>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 justify-between gap-3 pr-3 [&:last-child]:mb-3">
        {displayList.map(surah => (
          <SurahCard key={surah.number} surah={surah} />
        ))}
      </div>
    );
  };

  // Main render function
  const renderContent = () => {
    if (isLoading) return <Loading />;
    if (sortBtnActive === "Para" && juzData.length > 0) {
      return renderJuzView();
    }
    return renderNormalView();
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("surahsList", JSON.stringify(surahsList));
  }, [surahsList]);

  return (
	<div className="w-full h-full px-4 bg-[#023020] roundedmd lg:m-0 lg:rounded-lg lg:mt-0">
	<div className="flex flex-col-reverse items-start justify-between mr-3 sm:flex-row sm:items-center">
	 
	  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 mt-4 mb-4 bg-white rounded-md shadow-md">
  {["Number", "Alphabet", "Para", "In List"].map((sortBtn, index) => (
    <button
      key={index}
      onClick={() => setSortBtnActive(sortBtn)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition ${
        sortBtnActive === sortBtn
          ? "bg-[#023020] text-white shadow-md"
          : "bg-gray-300 text-gray-900 hover:bg-gray-200"
      }`}
    >
      {sortBtn}
    </button>
  ))}
</div>

	  <div className="w-full sm:w-[250px] md:w-[300px] xl:w-[500px] mt-3 sm:mt-0">
		<Input
		  type="text"
		  value={searchValue}
		  onchange={setSearchValue}
		  placeholder="Al-Baqara, 2, etc..."
		/>
	  </div>
	</div>
	<div className="h-[calc(100%-109px)] lg:h-[calc(100vh-162px)] overflow-y-scroll">
	  {renderContent()}
	</div>
  </div>
);
};

export default Home;
