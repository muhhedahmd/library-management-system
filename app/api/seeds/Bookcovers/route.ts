import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// Picsum Photos image data
const picsumImages = [
  {
    id: "0",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/yC-Yzbqy7PY",
    download_url: "https://picsum.photos/id/0/5000/3333",
  },
  {
    id: "1",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/LNRyGwIJr5c",
    download_url: "https://picsum.photos/id/1/5000/3333",
  },
  {
    id: "2",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/N7XodRrbzS0",
    download_url: "https://picsum.photos/id/2/5000/3333",
  },
  {
    id: "3",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/Dl6jeyfihLk",
    download_url: "https://picsum.photos/id/3/5000/3333",
  },
  {
    id: "4",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/y83Je1OC6Wc",
    download_url: "https://picsum.photos/id/4/5000/3333",
  },
  {
    id: "5",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3334,
    url: "https://unsplash.com/photos/LF8gK8-HGSg",
    download_url: "https://picsum.photos/id/5/5000/3334",
  },
  {
    id: "6",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/tAKXap853rY",
    download_url: "https://picsum.photos/id/6/5000/3333",
  },
  {
    id: "7",
    author: "Alejandro Escamilla",
    width: 4728,
    height: 3168,
    url: "https://unsplash.com/photos/BbQLHCpVUqA",
    download_url: "https://picsum.photos/id/7/4728/3168",
  },
  {
    id: "8",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/xII7efH1G6o",
    download_url: "https://picsum.photos/id/8/5000/3333",
  },
  {
    id: "9",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3269,
    url: "https://unsplash.com/photos/ABDTiLqDhJA",
    download_url: "https://picsum.photos/id/9/5000/3269",
  },
  {
    id: "10",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/6J--NXulQCs",
    download_url: "https://picsum.photos/id/10/2500/1667",
  },
  {
    id: "11",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/Cm7oKel-X2Q",
    download_url: "https://picsum.photos/id/11/2500/1667",
  },
  {
    id: "12",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/I_9ILwtsl_k",
    download_url: "https://picsum.photos/id/12/2500/1667",
  },
  {
    id: "13",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/3MtiSMdnoCo",
    download_url: "https://picsum.photos/id/13/2500/1667",
  },
  {
    id: "14",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/IQ1kOQTJrOQ",
    download_url: "https://picsum.photos/id/14/2500/1667",
  },
  {
    id: "15",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/NYDo21ssGao",
    download_url: "https://picsum.photos/id/15/2500/1667",
  },
  {
    id: "16",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/gkT4FfgHO5o",
    download_url: "https://picsum.photos/id/16/2500/1667",
  },
  {
    id: "17",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/Ven2CV8IJ5A",
    download_url: "https://picsum.photos/id/17/2500/1667",
  },
  {
    id: "18",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/Ps2n0rShqaM",
    download_url: "https://picsum.photos/id/18/2500/1667",
  },
  {
    id: "19",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/P7Lh0usGcuk",
    download_url: "https://picsum.photos/id/19/2500/1667",
  },
  {
    id: "20",
    author: "Aleks Dorohovich",
    width: 3670,
    height: 2462,
    url: "https://unsplash.com/photos/nJdwUHmaY8A",
    download_url: "https://picsum.photos/id/20/3670/2462",
  },
  {
    id: "21",
    author: "Alejandro Escamilla",
    width: 3008,
    height: 2008,
    url: "https://unsplash.com/photos/jVb0mSn0LbE",
    download_url: "https://picsum.photos/id/21/3008/2008",
  },
  {
    id: "22",
    author: "Alejandro Escamilla",
    width: 4434,
    height: 3729,
    url: "https://unsplash.com/photos/du_OrQAA4r0",
    download_url: "https://picsum.photos/id/22/4434/3729",
  },
  {
    id: "23",
    author: "Alejandro Escamilla",
    width: 3887,
    height: 4899,
    url: "https://unsplash.com/photos/8yqds_91OLw",
    download_url: "https://picsum.photos/id/23/3887/4899",
  },
  {
    id: "24",
    author: "Alejandro Escamilla",
    width: 4855,
    height: 1803,
    url: "https://unsplash.com/photos/cZhUxIQjILg",
    download_url: "https://picsum.photos/id/24/4855/1803",
  },
  {
    id: "25",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/Iuq0EL4EINY",
    download_url: "https://picsum.photos/id/25/5000/3333",
  },
  {
    id: "26",
    author: "Vadim Sherbakov",
    width: 4209,
    height: 2769,
    url: "https://unsplash.com/photos/tCICLJ5ktBE",
    download_url: "https://picsum.photos/id/26/4209/2769",
  },
  {
    id: "27",
    author: "Yoni Kaplan-Nadel",
    width: 3264,
    height: 1836,
    url: "https://unsplash.com/photos/iJnZwLBOB1I",
    download_url: "https://picsum.photos/id/27/3264/1836",
  },
  {
    id: "28",
    author: "Jerry Adney",
    width: 4928,
    height: 3264,
    url: "https://unsplash.com/photos/_WiFMBRT7Aw",
    download_url: "https://picsum.photos/id/28/4928/3264",
  },
  {
    id: "29",
    author: "Go Wild",
    width: 4000,
    height: 2670,
    url: "https://unsplash.com/photos/V0yAek6BgGk",
    download_url: "https://picsum.photos/id/29/4000/2670",
  },
  {
    id: "30",
    author: "Shyamanta Baruah",
    width: 1280,
    height: 901,
    url: "https://unsplash.com/photos/aeVA-j1y2BY",
    download_url: "https://picsum.photos/id/30/1280/901",
  },
  {
    id: "31",
    author: "How-Soon Ngu",
    width: 3264,
    height: 4912,
    url: "https://unsplash.com/photos/7Vz3DtQDT3Q",
    download_url: "https://picsum.photos/id/31/3264/4912",
  },
  {
    id: "32",
    author: "Rodrigo Melo",
    width: 4032,
    height: 3024,
    url: "https://unsplash.com/photos/eG3k60PrTGY",
    download_url: "https://picsum.photos/id/32/4032/3024",
  },
  {
    id: "33",
    author: "Alejandro Escamilla",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/LBI7cgq3pbM",
    download_url: "https://picsum.photos/id/33/5000/3333",
  },
  {
    id: "34",
    author: "Aleks Dorohovich",
    width: 3872,
    height: 2592,
    url: "https://unsplash.com/photos/zZvsEMPxjIA",
    download_url: "https://picsum.photos/id/34/3872/2592",
  },
  {
    id: "35",
    author: "Shane Colella",
    width: 2758,
    height: 3622,
    url: "https://unsplash.com/photos/znM0ujn2RUA",
    download_url: "https://picsum.photos/id/35/2758/3622",
  },
  {
    id: "36",
    author: "Vadim Sherbakov",
    width: 4179,
    height: 2790,
    url: "https://unsplash.com/photos/osSryggkso4",
    download_url: "https://picsum.photos/id/36/4179/2790",
  },
  {
    id: "37",
    author: "Austin Neill",
    width: 2000,
    height: 1333,
    url: "https://unsplash.com/photos/erTjj730fMk",
    download_url: "https://picsum.photos/id/37/2000/1333",
  },
  {
    id: "38",
    author: "Allyson Souza",
    width: 1280,
    height: 960,
    url: "https://unsplash.com/photos/JabLtzJl8bc",
    download_url: "https://picsum.photos/id/38/1280/960",
  },
  {
    id: "39",
    author: "Luke Chesser",
    width: 3456,
    height: 2304,
    url: "https://unsplash.com/photos/pFqrYbhIAXs",
    download_url: "https://picsum.photos/id/39/3456/2304",
  },
  {
    id: "40",
    author: "Ryan Mcguire",
    width: 4106,
    height: 2806,
    url: "https://unsplash.com/photos/N-1XGL54pQg",
    download_url: "https://picsum.photos/id/40/4106/2806",
  },
  {
    id: "41",
    author: "Nithya Ramanujam",
    width: 1280,
    height: 805,
    url: "https://unsplash.com/photos/fTKetYpEKNQ",
    download_url: "https://picsum.photos/id/41/1280/805",
  },
  {
    id: "42",
    author: "Luke Chesser",
    width: 3456,
    height: 2304,
    url: "https://unsplash.com/photos/KR2mdHJ5qMg",
    download_url: "https://picsum.photos/id/42/3456/2304",
  },
  {
    id: "43",
    author: "Oleg Chursin",
    width: 1280,
    height: 831,
    url: "https://unsplash.com/photos/IoCWq07GaG4",
    download_url: "https://picsum.photos/id/43/1280/831",
  },
  {
    id: "44",
    author: "Christopher Sardegna",
    width: 4272,
    height: 2848,
    url: "https://unsplash.com/photos/R1E6x8U83Ho",
    download_url: "https://picsum.photos/id/44/4272/2848",
  },
  {
    id: "45",
    author: "Alan Haverty",
    width: 4592,
    height: 2576,
    url: "https://unsplash.com/photos/-XA-fTYYfV0",
    download_url: "https://picsum.photos/id/45/4592/2576",
  },
  {
    id: "46",
    author: "Jeffrey Kam",
    width: 3264,
    height: 2448,
    url: "https://unsplash.com/photos/Nzw3HHsNHYU",
    download_url: "https://picsum.photos/id/46/3264/2448",
  },
  {
    id: "47",
    author: "Christopher Sardegna",
    width: 4272,
    height: 2848,
    url: "https://unsplash.com/photos/uDUiRS8YroY",
    download_url: "https://picsum.photos/id/47/4272/2848",
  },
  {
    id: "48",
    author: "Luke Chesser",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/1uxV8fAfhVM",
    download_url: "https://picsum.photos/id/48/5000/3333",
  },
  {
    id: "49",
    author: "Margaret Barley",
    width: 1280,
    height: 792,
    url: "https://unsplash.com/photos/Qo51KwK1dKg",
    download_url: "https://picsum.photos/id/49/1280/792",
  },
  {
    id: "50",
    author: "Tyler Wanlass",
    width: 4608,
    height: 3072,
    url: "https://unsplash.com/photos/L7MpmBGpM94",
    download_url: "https://picsum.photos/id/50/4608/3072",
  },
  {
    id: "51",
    author: "Ireneuilia",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/knYQ6arClBE",
    download_url: "https://picsum.photos/id/51/5000/3333",
  },
  {
    id: "52",
    author: "Cierra",
    width: 1280,
    height: 853,
    url: "https://unsplash.com/photos/57vHdjeZ0yg",
    download_url: "https://picsum.photos/id/52/1280/853",
  },
  {
    id: "53",
    author: "J Duclos",
    width: 1280,
    height: 1280,
    url: "https://unsplash.com/photos/6qORI5j_6n8",
    download_url: "https://picsum.photos/id/53/1280/1280",
  },
  {
    id: "54",
    author: "Nicholas Swanson",
    width: 3264,
    height: 2176,
    url: "https://unsplash.com/photos/d19by2PLaPc",
    download_url: "https://picsum.photos/id/54/3264/2176",
  },
  {
    id: "55",
    author: "Tyler Wanlass",
    width: 4608,
    height: 3072,
    url: "https://unsplash.com/photos/akbHiqZy4Pg",
    download_url: "https://picsum.photos/id/55/4608/3072",
  },
  {
    id: "56",
    author: "Sebastian Muller",
    width: 2880,
    height: 1920,
    url: "https://unsplash.com/photos/VLdaxYyXJvw",
    download_url: "https://picsum.photos/id/56/2880/1920",
  },
  {
    id: "57",
    author: "Nicholas Swanson",
    width: 2448,
    height: 3264,
    url: "https://unsplash.com/photos/SyBYM8R6VU4",
    download_url: "https://picsum.photos/id/57/2448/3264",
  },
  {
    id: "58",
    author: "Tony Naccarato",
    width: 1280,
    height: 853,
    url: "https://unsplash.com/photos/-kEr-QltARg",
    download_url: "https://picsum.photos/id/58/1280/853",
  },
  {
    id: "59",
    author: "Art Wave",
    width: 2464,
    height: 1632,
    url: "https://unsplash.com/photos/algEQavPY4M",
    download_url: "https://picsum.photos/id/59/2464/1632",
  },
  {
    id: "60",
    author: "Vadim Sherbakov",
    width: 1920,
    height: 1200,
    url: "https://unsplash.com/photos/Hi9GSwWkCJk",
    download_url: "https://picsum.photos/id/60/1920/1200",
  },
  {
    id: "61",
    author: "Alex",
    width: 3264,
    height: 2448,
    url: "https://unsplash.com/photos/zMz14hsbpuU",
    download_url: "https://picsum.photos/id/61/3264/2448",
  },
  {
    id: "62",
    author: "Daniel Genser",
    width: 2000,
    height: 1333,
    url: "https://unsplash.com/photos/PzPbh-faPgU",
    download_url: "https://picsum.photos/id/62/2000/1333",
  },
  {
    id: "63",
    author: "Justin Leibow",
    width: 5000,
    height: 2813,
    url: "https://unsplash.com/photos/ZJsseAxEcqM",
    download_url: "https://picsum.photos/id/63/5000/2813",
  },
  {
    id: "64",
    author: "Alexander Shustov",
    width: 4326,
    height: 2884,
    url: "https://unsplash.com/photos/AHBiSKaENwc",
    download_url: "https://picsum.photos/id/64/4326/2884",
  },
  {
    id: "65",
    author: "Alexander Shustov",
    width: 4912,
    height: 3264,
    url: "https://unsplash.com/photos/2FrX56QL7P8",
    download_url: "https://picsum.photos/id/65/4912/3264",
  },
  {
    id: "66",
    author: "Nicholas Swanson",
    width: 3264,
    height: 2448,
    url: "https://unsplash.com/photos/agnhLQWqr1Q",
    download_url: "https://picsum.photos/id/66/3264/2448",
  },
  {
    id: "67",
    author: "Rula Sibai",
    width: 2848,
    height: 4288,
    url: "https://unsplash.com/photos/QbkGwv3xtmQ",
    download_url: "https://picsum.photos/id/67/2848/4288",
  },
  {
    id: "68",
    author: "Cristian Moscoso",
    width: 4608,
    height: 3072,
    url: "https://unsplash.com/photos/2SfRAWkinpU",
    download_url: "https://picsum.photos/id/68/4608/3072",
  },
  {
    id: "69",
    author: "Alexander Shustov",
    width: 4912,
    height: 3264,
    url: "https://unsplash.com/photos/SITaCHf7jjg",
    download_url: "https://picsum.photos/id/69/4912/3264",
  },
  {
    id: "70",
    author: "Dorothy Lin",
    width: 3011,
    height: 2000,
    url: "https://unsplash.com/photos/OokBLPrkCNk",
    download_url: "https://picsum.photos/id/70/3011/2000",
  },
  {
    id: "71",
    author: "Jon Eckert",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/IoIbdFdGCnQ",
    download_url: "https://picsum.photos/id/71/5000/3333",
  },
  {
    id: "72",
    author: "Tyler Finck",
    width: 3000,
    height: 2000,
    url: "https://unsplash.com/photos/Cs4QZdHrHt4",
    download_url: "https://picsum.photos/id/72/3000/2000",
  },
  {
    id: "73",
    author: "Jon Eckert",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/umLpP7uCZs0",
    download_url: "https://picsum.photos/id/73/5000/3333",
  },
  {
    id: "74",
    author: "Isaak Dury",
    width: 4288,
    height: 2848,
    url: "https://unsplash.com/photos/YhZbnxqtooM",
    download_url: "https://picsum.photos/id/74/4288/2848",
  },
  {
    id: "75",
    author: "Jassy Onyae",
    width: 1999,
    height: 2998,
    url: "https://unsplash.com/photos/1gBUXhf0PtA",
    download_url: "https://picsum.photos/id/75/1999/2998",
  },
  {
    id: "76",
    author: "Alexander Shustov",
    width: 4912,
    height: 3264,
    url: "https://unsplash.com/photos/OxzhYtL-00Y",
    download_url: "https://picsum.photos/id/76/4912/3264",
  },
  {
    id: "77",
    author: "May Pamintuan",
    width: 1631,
    height: 1102,
    url: "https://unsplash.com/photos/j9nfqTi5T5o",
    download_url: "https://picsum.photos/id/77/1631/1102",
  },
  {
    id: "78",
    author: "Paul Evans",
    width: 1584,
    height: 2376,
    url: "https://unsplash.com/photos/CtkDsu4w-Rs",
    download_url: "https://picsum.photos/id/78/1584/2376",
  },
  {
    id: "79",
    author: "Dorothy Lin",
    width: 2000,
    height: 3011,
    url: "https://unsplash.com/photos/TIr6EwYMRUM",
    download_url: "https://picsum.photos/id/79/2000/3011",
  },
  {
    id: "80",
    author: "Sonja Langford",
    width: 3888,
    height: 2592,
    url: "https://unsplash.com/photos/Y2PYfopoz-k",
    download_url: "https://picsum.photos/id/80/3888/2592",
  },
  {
    id: "81",
    author: "Sander Weeteling",
    width: 5000,
    height: 3250,
    url: "https://unsplash.com/photos/rlxZqmc6D_I",
    download_url: "https://picsum.photos/id/81/5000/3250",
  },
  {
    id: "82",
    author: "Rula Sibai",
    width: 1500,
    height: 997,
    url: "https://unsplash.com/photos/-vq7mi4oF0s",
    download_url: "https://picsum.photos/id/82/1500/997",
  },
  {
    id: "83",
    author: "Julie Geiger",
    width: 2560,
    height: 1920,
    url: "https://unsplash.com/photos/dYshDcTI1Js",
    download_url: "https://picsum.photos/id/83/2560/1920",
  },
  {
    id: "84",
    author: "Johnny Lam",
    width: 1280,
    height: 848,
    url: "https://unsplash.com/photos/63qfL0TciY8",
    download_url: "https://picsum.photos/id/84/1280/848",
  },
  {
    id: "85",
    author: "Gozha Net",
    width: 1280,
    height: 774,
    url: "https://unsplash.com/photos/xDrxJCdedcI",
    download_url: "https://picsum.photos/id/85/1280/774",
  },
  {
    id: "87",
    author: "Barcelona",
    width: 1280,
    height: 960,
    url: "https://unsplash.com/photos/o697BgRH_-M",
    download_url: "https://picsum.photos/id/87/1280/960",
  },
  {
    id: "88",
    author: "Barcelona",
    width: 1280,
    height: 1707,
    url: "https://unsplash.com/photos/muC_6gTMLR4",
    download_url: "https://picsum.photos/id/88/1280/1707",
  },
  {
    id: "89",
    author: "Vectorbeast",
    width: 4608,
    height: 2592,
    url: "https://unsplash.com/photos/rsJtMXn3p_c",
    download_url: "https://picsum.photos/id/89/4608/2592",
  },
  {
    id: "90",
    author: "Rula Sibai",
    width: 3000,
    height: 1992,
    url: "https://unsplash.com/photos/qVj3KuEikvg",
    download_url: "https://picsum.photos/id/90/3000/1992",
  },
  {
    id: "91",
    author: "Jennifer Trovato",
    width: 3504,
    height: 2336,
    url: "https://unsplash.com/photos/baRYCsjO6z4",
    download_url: "https://picsum.photos/id/91/3504/2336",
  },
  {
    id: "92",
    author: "Rafael Souza",
    width: 3568,
    height: 2368,
    url: "https://unsplash.com/photos/QxkBP3A9XmU",
    download_url: "https://picsum.photos/id/92/3568/2368",
  },
  {
    id: "93",
    author: "Caroline Sada",
    width: 2000,
    height: 1334,
    url: "https://unsplash.com/photos/r1XwWjI4PyE",
    download_url: "https://picsum.photos/id/93/2000/1334",
  },
  {
    id: "94",
    author: "Jean Kleisz",
    width: 2133,
    height: 1200,
    url: "https://unsplash.com/photos/4yzPVohNuVI",
    download_url: "https://picsum.photos/id/94/2133/1200",
  },
  {
    id: "95",
    author: "Kundan Ramisetti",
    width: 2048,
    height: 2048,
    url: "https://unsplash.com/photos/87TJNWkepvI",
    download_url: "https://picsum.photos/id/95/2048/2048",
  },
  {
    id: "96",
    author: "Pawel Kadysz",
    width: 4752,
    height: 3168,
    url: "https://unsplash.com/photos/CuFYW1c97w8",
    download_url: "https://picsum.photos/id/96/4752/3168",
  },
  {
    id: "98",
    author: "Laurice Solomon",
    width: 3264,
    height: 2176,
    url: "https://unsplash.com/photos/ThJIf6Q0b2s",
    download_url: "https://picsum.photos/id/98/3264/2176",
  },
  {
    id: "99",
    author: "Jon Toney",
    width: 4912,
    height: 3264,
    url: "https://unsplash.com/photos/xyDQNmT6vSs",
    download_url: "https://picsum.photos/id/99/4912/3264",
  },
  {
    id: "100",
    author: "Tina Rataj",
    width: 2500,
    height: 1656,
    url: "https://unsplash.com/photos/pwaaqfoMibI",
    download_url: "https://picsum.photos/id/100/2500/1656",
  },
  {
    id: "101",
    author: "Christian Bardenhorst",
    width: 2621,
    height: 1747,
    url: "https://unsplash.com/photos/8lMhzUjD1Wk",
    download_url: "https://picsum.photos/id/101/2621/1747",
  },
]

// Function to get a Picsum image URL with custom dimensions
function getPicsumImageUrl(imageId, width = 800, height = 1200) {
  return `https://picsum.photos/id/${imageId}/${width}/${height}`
}

// Function to get a thumbnail URL
function getPicsumThumbnailUrl(imageId, width = 200, height = 300) {
  return `https://picsum.photos/id/${imageId}/${width}/${height}`
}

export async function POST() {
  try {
    // Check if books exist
    const existingBookCount = await prisma.book.count()
    if (existingBookCount === 0) {
      return NextResponse.json({
        success: false,
        message: "No books found in the database.",
        count: existingBookCount,
      })
    }

    console.log(`Found ${existingBookCount} books. Assigning Picsum images as covers...`)

    // Get all books
    const books = await prisma.book.findMany()

    // Delete all existing book covers first
    // await prisma.bookCover.deleteMany({})
    // console.log("Deleted existing book covers")

    // Track statistics
    const updatedBooks = []
    const usedImages = {}
    const categoryCovers = {}

    // Get all categories to track which images are assigned to which categories
    const categories = await prisma.category.findMany()

    // Create a mapping of category IDs to names for reporting
    const categoryNames = {}
    categories.forEach((category) => {
      categoryNames[category.id] = category.name
    })

    // Assign images to books
    for (let i = 0; i < books.length; i++) {
      const book = books[i]

      // Get a Picsum image for this book
      // Use modulo to cycle through the available images
      const imageIndex = i % picsumImages.length
      const picsumImage = picsumImages[imageIndex]

      // Create book cover using Picsum image
      await prisma.bookCover.create({
        data: {
          bookId: book.id,
          fileUrl: getPicsumImageUrl(picsumImage.id),
          name: `Cover for ${book.title}`,
          fileSize: `${Math.floor(Math.random() * 500) + 100} KB`,
          width: 800,
          height: 1200,
          fileFormat: "JPEG",
          type: "Image",
          blurHash: "LGF5?xYk^6#M@-5c,1J5@[or[Q6.",
            
        //   metadata: JSON.stringify({
        //     photographer: picsumImage.author,
        //     originalUrl: picsumImage.download_url,
        //     picsumId: picsumImage.id,
        //   }),
        },
      })

      // Create thumbnail
      await prisma.bookCover.create({
        data: {
          bookId: book.id,
          fileUrl: getPicsumThumbnailUrl(picsumImage.id),
          name: `Thumbnail for ${book.title}`,
          fileSize: `${Math.floor(Math.random() * 100) + 20} KB`,
          width: 200,
          height: 300,
          fileFormat: "JPEG",
          type: "THUMBNAIL",
          blurHash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
      
        },
      })

      // Track usage statistics
      usedImages[picsumImage.id] = (usedImages[picsumImage.id] || 0) + 1
      updatedBooks.push(book.id)

      // Track which images are used for which categories
      if (book.categoryId) {
        const categoryName = categoryNames[book.categoryId] || book.categoryId
        if (!categoryCovers[categoryName]) {
          categoryCovers[categoryName] = []
        }
        if (!categoryCovers[categoryName].includes(picsumImage.id)) {
          categoryCovers[categoryName].push(picsumImage.id)
        }
      }

      // Log progress every 50 books
      if ((i + 1) % 50 === 0) {
        console.log(`Assigned covers to ${i + 1} of ${books.length} books...`)
      }
    }

    // Calculate photographer statistics
    const photographerStats = {}
    for (const imageId in usedImages) {
      const photographer = picsumImages.find((img) => img.id === imageId)?.author || "Unknown"
      photographerStats[photographer] = (photographerStats[photographer] || 0) + usedImages[imageId]
    }

    return NextResponse.json({
      success: true,
      message: `Successfully assigned Picsum Photos images as covers to ${updatedBooks.length} books`,
      stats: {
        totalBooksUpdated: updatedBooks.length,
        photographers: photographerStats,
        imagesUsed: Object.keys(usedImages).length,
        categoryCoverMapping: categoryCovers,
      },
    })
  } catch (error) {
    console.error("Error assigning book covers:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to assign book covers",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

