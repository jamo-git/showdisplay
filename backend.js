const fetch = require("node-fetch")
const cheerio = require("cheerio")
const { console, Date } = require("globalthis/implementation")

const daylengthreport = document.getElementById("daylength")
const namereport = document.getElementById("namedate")
// const weatherreport = document.getElementById("weather")

namereport.addEventListener("click", () => {
    console.log("speaking")
    playtext(namereport.innerText)
})

daylengthreport.addEventListener("click", () => {
    console.log("speaking")
    playtext(daylengthreport.innerText)
})

const utterance = new SpeechSynthesisUtterance()

utterance.lang = "en"
// utterance.addEventListener('end', () => {
//     txtIn.disabled = false
// })
// utterance.addEventListener("boundary", e => {
//     currentChar = e.charIndex
// })

function playtext(text) {
    if (speechSynthesis.speaking) {
        return speechSynthesis.resume()
    }
    if (speechSynthesis.speaking) return
    utterance.text = text
    speechSynthesis.speak(utterance)
}

playtext("Starting showdisplay. Fetching data")

utterance.lang = "fi"

async function getWebSiteData(site) {
    const response = await fetch(site)
    if (response.ok) {
        const receivedData = await response.text()
        return receivedData
    } else {
        return "No data received"
    }
}

async function getDayLength() {
    const getWebData = await getWebSiteData("https://www.viastar.fi/Aurinko_nousee_laskee/Forssa/") // Option 1, correct timezone
    // const getWebData = await getWebSiteData("https://www.auringonlasku.fi/forssa") // Option 2, timezone 1h off (amsterdam)
    try {
        const $ = cheerio.load(getWebData)
        const sunRise = $("body > table:nth-child(1) > tbody > tr > td:nth-child(1) > table > tbody > tr > td > b > font").text().match(/\d{1,2}:\d{1,2}/)
        const sunDown = $("body > table:nth-child(1) > tbody > tr > td:nth-child(1) > table > tbody > tr > td > p > font:nth-child(1) > b").text().match(/\d{1,2}:\d{1,2}/)
        // const sunRise = $("body > div:nth-child(2) > div.row > div:nth-child(1) > p:nth-child(2)").text().match(/\d{1,2}:\d{1,2}/) // Option 2
        // const sunDown = $("body > div:nth-child(2) > div.row > div:nth-child(1) > p:nth-child(4)").text().match(/\d{1,2}:\d{1,2}/) // Option 2
        daylengthreport.innerHTML = `Aurinko nousee ${sunRise} ja laskee ${sunDown}`
    } catch (e) {
        daylengthreport.innerText = "Ei saa parsittua päivän pituutta"
        console.log(e)
    }
}

async function nameDateToday() {
    const todayis = new Date()
    const getWebData = await getWebSiteData(`https://www.nimipaivat.fi/${todayis.getDate()}.${todayis.getMonth() + 1}.`)
    try {
        const $ = cheerio.load(getWebData)
        const names = $("body > div.container > div:nth-child(1) > div > p:nth-child(3)").text()
        namereport.innerHTML = `${names}`
    } catch (e) {
        namereport.innerText = "Ei saa parsittua nimipäivä tietoa"
        console.log(e)
    }
}

// async function getWeather() {
//     const getWebData = await getWebSiteData(`https://www.foreca.fi/Finland/Forssa/10vrk`)
//     const $ = cheerio.load(getWebData)
//     const weatherdata = $("body").find("#tenday").text()
//     console.log(weatherdata)
//     weatherreport.innerHTML = `${weatherdata}`
// }

getDayLength()
nameDateToday()
