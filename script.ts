function getExchangeRates (date? : Date) {
    const prevValues = document.getElementById('rates')
    prevValues.innerHTML = ''

    const specificDate : string = 'https://api.exchangeratesapi.io/'
    const latestDate : string = 'https://api.exchangeratesapi.io/latest'

    if (date) {
      document.getElementById('date').innerHTML = date.toLocaleDateString(navigator.language)
    } else {
      document.getElementById('date').innerHTML = new Date().toLocaleDateString(navigator.language)
    }

    const url = date ? specificDate + `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` : latestDate
  
    fetch(url).then(res => res.json()).then(res => {
      console.log(res)
      document.getElementById('base').innerHTML = '1 ' + res.base
      Object.keys(res.rates).map(function (objectKey, index) {
        const div = document.createElement('div')
        div.className = 'row'
        const key = document.createElement('p')
        key.className = 'currency'
        const val = document.createElement('p')
        val.className = 'value'
        const countryFlag = document.createElement('img')
        const calcId = document.getElementById('calcInput')
        const checkBox = document.createElement('input')
        checkBox.type = 'radio'
        checkBox.name = 'currency'
        checkBox.className = objectKey
        checkBox.onchange = function () {
            const checkboxes = document.querySelectorAll('input[type=radio]:checked')
            let tmp = ''
          calcId.innerHTML = ''
          for (let i = 0; i < checkboxes.length; i++) {
            const element = checkboxes[i]
            if (checkboxes.length - 1 > i) {
              tmp += element.className + ','
            } else {
              tmp += element.className
            }
            const buttonSwitch = document.createElement('button')
            const inputA = document.createElement('input')
  
            inputA.type = 'number'
            
            const inputB = document.createElement('input')
            inputA.onchange = function () {
              inputB.value =  (Number.parseFloat(inputA.value) * Number.parseFloat(value)).toString()
            }
  
            inputA.type = 'number'
            inputB.type = 'number'
  
            inputB.onchange = function () {
              const x = 1 / Number.parseFloat(value)
              inputA.value = (Number.parseFloat(inputB.value) * x).toString()
            }
            calcId.append(inputA)
            calcId.append(buttonSwitch)
            calcId.append(inputB)
          }
  
          fetch('https://api.exchangeratesapi.io/history?start_at=2018-01-01&end_at=2018-09-01&symbols=' + decodeURI(tmp)).then(res => res.json())
            .then(res => {
              console.log(Object.entries(res.rates).map(([key, value]) => ({ key, value })))
            })
        }
        checkBox.innerText = 'Graph'
  
        const value = res.rates[objectKey]
        key.textContent = objectKey
        val.textContent = value
        countryFlag.src = `https://www.countryflags.io/${objectKey.slice(0, 2)}/flat/32.png`
  
        div.appendChild(key)
        div.append(countryFlag)
        div.appendChild(val)
        div.append(checkBox)
        const element = document.getElementById('rates')
        element.appendChild(div)
      })
    })
  }
  
  window.addEventListener('load', () => {
    console.log('document loaded')
    getExchangeRates()
  })
  
  document.getElementById('dateInput').addEventListener('change', (val) => {
    getExchangeRates(new Date(document.getElementById('dateInput').value))
  })
  
  document.getElementById('latestButton').addEventListener('click', (val) => {
    getExchangeRates()
    document.getElementById('dateInput').value = new Date()
  })
  