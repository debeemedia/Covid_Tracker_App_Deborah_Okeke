// reference html elements
const main = document.querySelector('main')
const nav = document.querySelector('nav')
const popup = document.querySelector('.popup')
const overlay = document.querySelector('.overlay')
const closePopupBtn = document.createElement('span')
closePopupBtn.className = 'closePopupBtn'

// reference api url
const covidApi = `https://disease.sh/v3/covid-19/countries`

// create function to fetch covid data
async function fetchData () {
    try {
        const response = await fetch(covidApi)
        const data = response.json()
        // console.log(data);
        return data
    }
    catch(error) {
        console.log('Error: ' + error);
    }
}
fetchData()

// create function to display covid data and paginate
const populateDom = async () => {
    const covidData = await fetchData()
    const countryDataFlag = covidData.map(country => country.countryInfo.flag)
    // console.log(countryDataFlag);
    const countryDataName = covidData.map(country => country.country)
    // console.log(countryDataName);
    const countryDataContinent = covidData.map(country => country.continent)
    console.log(countryDataContinent);
    const countryDataPopulation = covidData.map(country => country.population)
    console.log(countryDataPopulation);
    const countryTodayReportedCases = covidData.map(country => country.todayCases)
    // console.log(countryTodayReportedCases);
    const countryTodayConfirmedDeaths = covidData.map(country => country.todayDeaths)
    // console.log(countryTodayConfirmedDeaths);
    const countryTotalInfectedCases = covidData.map(country => country.cases)
    const countryTotalRecoveredCases = covidData.map(country => country.recovered)
    const countryTotalConfirmedDeaths = covidData.map(country => country.deaths)

    let currentPage = 1
    let itemsPerPage = 12
    let totalPages = Math.ceil(covidData.length / itemsPerPage)

    const cardOuterContainer = document.createElement('div')
    cardOuterContainer.className = 'cardOuterContainer'

    // create function to display pages
    function displayPage() {
        let startIndex = (currentPage - 1) * itemsPerPage
        let endIndex = startIndex + itemsPerPage

        for (let i = startIndex; i < endIndex && i < covidData.length; i++) {
            const card = document.createElement('div')
            card.className = 'card'

            const cardImgDiv = document.createElement('div')
            cardImgDiv.className = 'cardImgDiv'
            const cardImg = document.createElement('img')
            cardImg.src = countryDataFlag[i]
            cardImg.className = 'cardImg'
            cardImgDiv.append(cardImg)

            const cardBody = document.createElement('span')
            cardBody.className = 'cardBody'

            const cardCountry = document.createElement('h3')
            cardCountry.innerText = countryDataName[i]
            cardCountry.className = 'cardCountry'
            
            const cardContinent = document.createElement('p')
            cardContinent.innerText = countryDataContinent[i]
            cardContinent.className = 'cardContinent'

            cardBody.append(cardCountry, cardContinent)
            card.append(cardImgDiv, cardBody)

            // add event listener to show and hide popup
            cardImgDiv.addEventListener('click', () => showPopup(i))
            cardCountry.addEventListener('click', () => showPopup(i))

            overlay.addEventListener('click', closePopup)
            closePopupBtn.addEventListener('click', closePopup)
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && !popup.classList.contains('hidden')) {
                    closePopup()
                }
            })
            cardOuterContainer.append(card)

        }
        main.append(cardOuterContainer)

        // create function to show popup
        function showPopup(index) {
            closePopupBtn.innerHTML = `<span class="material-symbols-outlined">
            close
            </span>`

            const popupContainer = document.createElement('div')
            popupContainer.className = 'popupContainer'

            const countryInfoDiv = document.createElement('div')

            const countryImgDiv = document.createElement('div')
            const countryImg = document.createElement('img')
            countryImg.src = countryDataFlag[index]
            countryImgDiv.append(countryImg)

            const countryName = document.createElement('h3')
            countryName.innerText = countryDataName[index]
            const countryPopulation = document.createElement('p')
            countryPopulation.innerText = `Population: ${countryDataPopulation[index]} people`

            countryInfoDiv.append(countryImgDiv, countryName, countryPopulation)

            const countryCasesDiv = document.createElement('div')

            const todayReportedCases = document.createElement('p')
            todayReportedCases.innerText = `Today's Reported Cases: ${countryTodayReportedCases[index]} people`
            const todayConfirmedDeaths = document.createElement('p')
            todayConfirmedDeaths.innerText = `Today's Confirmed Deaths: ${countryTodayConfirmedDeaths[index]} people`
            const totalInfectedCases = document.createElement('p')
            totalInfectedCases.innerText = `Total Infected Cases: ${countryTotalInfectedCases[index]} people`
            const totalRecoveredCases = document.createElement('p')
            totalRecoveredCases.innerText = `Total Recovered Cases: ${countryTotalRecoveredCases[index]} people`
            const totalConfirmedDeaths = document.createElement('p')
            totalConfirmedDeaths.innerText = `Total Confirmed Deaths: ${countryTotalConfirmedDeaths[index]} people`

            countryCasesDiv.append(todayReportedCases, todayConfirmedDeaths, totalInfectedCases, totalRecoveredCases, totalConfirmedDeaths)

            popupContainer.append(countryInfoDiv, countryCasesDiv)
            popup.append(closePopupBtn, popupContainer)

            popup.classList.remove('hidden')
            overlay.classList.remove('hidden')

    
            
        }
        // create function to close popup
        function closePopup () {
            popup.innerHTML = ''
            popup.classList.add('hidden')
            overlay.classList.add('hidden')
        }
    }

    // create page navigation
    const previousButton = document.createElement('span')
    previousButton.innerHTML = '<span class="material-symbols-outlined">navigate_before</span>'
    
    const nextButton = document.createElement('span')
    nextButton.innerHTML = '<span class="material-symbols-outlined">navigate_next</span>'
    
    nav.append(previousButton, nextButton)
    
    // add functionality to buttons
    previousButton.addEventListener('click', () => {
        cardOuterContainer.innerHTML = ''
        if (currentPage > 1) {
            currentPage--
            displayPage()
            updateButtonVisibility()
        }
    })
    
    nextButton.addEventListener('click', () => {
        cardOuterContainer.innerHTML = ''
        if (currentPage < totalPages) {
            currentPage++
            displayPage()
            updateButtonVisibility()
        }
    })
    
    // function to set button visibility
    function updateButtonVisibility() {
        if (currentPage <= 1) {
            previousButton.hidden = true
        } else {
            previousButton.hidden = false
        }

        if (currentPage >= totalPages) {
            nextButton.hidden = true
        } else {
            nextButton.hidden = false
        }
    }
    displayPage()
    updateButtonVisibility()
}
populateDom()