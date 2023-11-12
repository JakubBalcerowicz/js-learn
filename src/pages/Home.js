import LoginPage from '../pages/LoginPage';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


export default function Home(props){

  const [value, onChange] = useState(new Date());

    getData(props.name, value)
    //getDataForWeekView(props.name)
    return (
      <>
        <div className='home-container'>
          {props.status ? 
          <>
            <div className="column"> 
              <Calendar onChange = {onChange} value={value}/>
              <p>Wiadmosci:</p>
              <form className = "addActivity-form"action="http://51.20.120.30:5000/addActivity" method="post">
                <div className="input-container">
                  <input type="hidden" value = {value} name="data" required />
                </div>
                <div className="input-container">
                  <label>Trening </label>
                  <select type="text" name="trening">
                    <option value="Bieganie">Bieganie</option>
                    <option value="Rower">Rower</option>
                    <option value="Plywanie">Plywanie</option>
                  </select>
                </div>
                <div className="input-container">
                  <label>Dystans </label>
                  <input type="text" name="dystans" required />
                </div>
                <div className="input-container">
                  <label>Godzina </label>
                  <input type="text" name="godzina" required />
                </div>
                    <input type="submit" name="Dodaj trening" value="Dodaj trening" />
              </form>
            </div>
            <div className="column">
              <h1>Treningi na najblizszy tydzien</h1>
              <div className="column-week-view-js">
                asd
              </div>
            </div>          
          </> 
          : 
          <LoginPage />}
        </div>
      </>
    )

}

function getData(userName, selectedDate){

  const baseUrl = 'http://51.20.120.30:5000/usersData'

  let weekViewHTML=""
  let dayViewHTML =""
  const res =   fetch(baseUrl,
    {
      method: 'GET',
      credentials: 'include',
    }).then(res => {  
      return res.json()
    }).then(data => {
      data.forEach(user => {
        if(user.name === userName){
          dayViewHTML = formatDataForDayView(user, selectedDate)
          //dodac sortowanie do week view
          weekViewHTML = formatDataForWeekView(user)
        }
      });
      formatWeekViewHTML(weekViewHTML)  
      formatDayViewHTML(dayViewHTML)     
    }).catch(error => console.log(error))  
}

function processUserData(data){
  return `${Object.values(data.data).join('').toString().substring(0, 15)}<br>
          Trening: ${Object.values(data.trening).join('')}<br>
          Dystans: ${Object.values(data.dystans).join('')}<br>
          Godzina: ${Object.values(data.godzina).join('')}<br>
          <form className = "deleteActivity-form" action="http://localhost:5000/deleteActivity" method="post">
          <input type="hidden" value = "${Object.values(data.data).join('')}" name="data" required />
          <input type="hidden" value = "${Object.values(data.godzina).join('')}" name="godzina" required />
          <input type="submit" name="Usun" value="Usun trening" />
          </form>
          `
}

function formatDataForWeekView(user){
  let messHTML = ""
  Object.values(user.messages).forEach(mess => {
    const dateFromApi = Object.values(mess.data).join('').toString().substring(0, 15)
    for(let i = 0; i < 7; i++){
      const currentDate = new Date()
      let nextDay = new Date(currentDate)
      nextDay.setDate(currentDate.getDate() + i);
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const day = String(nextDay.getDate()).padStart(2, '0');
      const nextDayFormatted = `${daysOfWeek[nextDay.getDay()]} ${nextDay.toLocaleString('en-US', { month: 'short' })} ${day} ${nextDay.getFullYear()}`;
      
      if(i === 0){
        console.log("data z aPI: " + dateFromApi)
        console.log("data z kodu: " + nextDayFormatted)
      }

      if(nextDayFormatted === dateFromApi){
        const partHTML = processUserData(mess)
        messHTML += `<p>${partHTML}</p>`
      }
    }
  })
  return messHTML
}

function formatDataForDayView(user, selectedDate){
  let messHTML = ""
  const date1 = selectedDate.toString().substring(0, 15)
  Object.values(user.messages).forEach(mess => {
    const date2 = Object.values(mess.data).join('').toString().substring(0, 15)
    if(date1 === date2){
      console.log(Object.values(mess.data).join('').toString())
      const partHTML = processUserData(mess)
      messHTML += `<p>${partHTML}</p>`
    }
  })
  return messHTML
}

function formatWeekViewHTML(weekViewHTML){
  if(weekViewHTML !== ""){
    document.querySelector('.column-week-view-js').innerHTML = weekViewHTML
    return
  }
  document.querySelector('.column-week-view-js').innerHTML = `<p>Brak treningu</p>`
}

function formatDayViewHTML(dayViewHTML){
  if(dayViewHTML !== ""){
    document.querySelector('p').innerHTML = dayViewHTML
    return
  }
  document.querySelector('p').innerHTML = `<p>Brak treningu</p>`
}