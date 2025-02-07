"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { FaSearch, FaThermometerHalf, FaWind, FaTint } from "react-icons/fa"
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi"

const weatherIcons = {
  Clear: WiDaySunny,
  Clouds: WiCloudy,
  Rain: WiRain,
  Snow: WiSnow,
  Thunderstorm: WiThunderstorm,
}

const climateChangeEffects = {
  hot: {
    color: "from-yellow-400 to-red-500",
    message: "Rising temperatures are a sign of global warming.",
  },
  cold: {
    color: "from-blue-400 to-indigo-500",
    message: "Extreme cold can be a result of disrupted weather patterns due to climate change.",
  },
  normal: {
    color: "from-green-400 to-blue-500",
    message: "Even mild weather can hide long-term climate trends.",
  },
}

export default function Home() {
  const [location, setLocation] = useState("")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [climateEffect, setClimateEffect] = useState(climateChangeEffects.normal)

  useEffect(() => {
    if (weather) {
      if (weather.main.temp > 30) {
        setClimateEffect(climateChangeEffects.hot)
      } else if (weather.main.temp < 10) {
        setClimateEffect(climateChangeEffects.cold)
      } else {
        setClimateEffect(climateChangeEffects.normal)
      }
    }
  }, [weather])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!location.trim()) {
      setError("Please enter a valid location")
      setLoading(false)
      return
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=3f420190590cb3679a8d8fb9d93288d7&units=metric`,
      )
      setWeather(response.data)
    } catch (err) {
      setError("Error fetching weather data")
    } finally {
      setLoading(false)
    }
  }

  const WeatherIcon = weather ? weatherIcons[weather.weather[0].main] || WiDaySunny : WiDaySunny

  return (
    <motion.div
      className={`flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br ${climateEffect.color}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-5xl font-bold mb-8 text-white"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        Climate Watch
      </motion.h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
        <div className="relative">
          <input
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter Location"
            className="w-full px-4 py-2 text-gray-700 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 mt-2 mr-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <FaSearch />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {loading && (
          <motion.div
            className="text-white text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Loading...
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          className="text-red-300 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}

      <AnimatePresence>
        {weather && (
          <motion.div
            className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2 className="text-3xl font-semibold mb-4 text-white">{weather.name}</h2>
            <div className="flex items-center justify-between mb-4">
              <WeatherIcon className="text-6xl text-white" />
              <div className="text-4xl font-bold text-white">{Math.round(weather.main.temp)}°C</div>
            </div>
            <p className="text-xl text-white mb-2">{weather.weather[0].description}</p>
            <div className="grid grid-cols-3 gap-4 text-white">
              <div className="flex items-center">
                <FaThermometerHalf className="mr-2" />
                <span>Feels like {Math.round(weather.main.feels_like)}°C</span>
              </div>
              <div className="flex items-center">
                <FaTint className="mr-2" />
                <span>{weather.main.humidity}%</span>
              </div>
              <div className="flex items-center">
                <FaWind className="mr-2" />
                <span>{weather.wind.speed} m/s</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        className="mt-8 text-white text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {climateEffect.message}
      </motion.p>

      <footer className="mt-auto text-white py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <p className="text-sm mb-2 md:mb-0">© {new Date().getFullYear()} Silas Okanlawon. All rights reserved.</p>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </motion.div>
  )
}

