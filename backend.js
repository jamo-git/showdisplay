const fetch = require("node-fetch")
const cheerio = require("cheerio")
const { console, Date } = require("globalthis/implementation")

const daylengthreport = document.getElementById("daylength")
const namereport = document.getElementById("namedate")
const covidreport = document.getElementById("koronadata")

namereport.addEventListener("click", () => {
    console.log(`speaking: ${namereport.innerText}`)
    playtext(namereport.innerText)
})

daylengthreport.addEventListener("click", () => {
    console.log(`speaking: ${daylengthreport.innerText}`)
    playtext(daylengthreport.innerText)
})

covidreport.addEventListener("click", () => {
    console.log(`speaking: ${covidreport.innerText}`)
    playtext(covidreport.innerText)
})

const utterance = new SpeechSynthesisUtterance()

utterance.lang = "en"

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

async function getWebJson(site) {
    const response = await fetch(site)
    if (response.ok) {
        const receivedData = await response.json()
        return receivedData
    } else {
        return "No data received"
    }
}

async function getDayLength() {
    const getWebData = await getWebSiteData("https://www.viastar.fi/Aurinko_nousee_laskee/Forssa/") // Option 1, correct timezone
    try {
        const $ = cheerio.load(getWebData)
        const sunRise = $("body > table:nth-child(1) > tbody > tr > td:nth-child(1) > table > tbody > tr > td > b > font").text().match(/\d{1,2}:\d{1,2}/)
        const sunDown = $("body > table:nth-child(1) > tbody > tr > td:nth-child(1) > table > tbody > tr > td > p > font:nth-child(1) > b").text().match(/\d{1,2}:\d{1,2}/)
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

async function currentCovidStatus() {
    const getCovidData = await getWebJson(`https://sampo.thl.fi/pivot/prod/fi/epirapo/covid19case/fact_epirapo_covid19case.json?row=hcdmunicipality2020-444995`)
    try {
        const totalCases = getCovidData["dataset"]["value"][0]
        covidreport.innerText = `Forssassa on ${totalCases} todettua koronatapausta`
    } catch (e) {
        covidreport.innerText = "Ei saatu COVID-19 tapauksista haettua tietoa"
        console.log(e)
    }
}

getDayLength()
nameDateToday()
currentCovidStatus()