import './predictions.css'
import '../../index.css'
import {useState, useRef} from 'react'
import axios from 'axios';

function Predictions(props) {
  // const [listOfPrices, setListOfPrices] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false);
  const stockTicker = useRef()
  const predictionLength = useRef()
  const predictionPrice = useRef()

  async function postPrediction(){
    var initialPrice = 0

    // Store form input values when submit btn clicked
    const ticker = stockTicker.current.value 
    const length = predictionLength.current.value
    var time = new Date() 
    const predictedPrice = predictionPrice.current.value

    // Get and store current stock price (with TD Ameritrade API)
    await axios.get('https://api.tdameritrade.com/v1/marketdata/quotes?apikey=LMDASP6A1ADRYUA6YMIEWWCI7GEFTOFL&symbol=' + ticker)
    .then(response => {
      initialPrice = response['data'][ticker]['regularMarketLastPrice']
      //setListOfPrices(listOfPrices => [...listOfPrices, response['data'][ticker]['regularMarketLastPrice']]) 
    })
    .catch(error => {
      console.log(error)
    }) 
    console.log("initialPrice: " + initialPrice)

    // Post form input to the backend (with our API)
    fetch('http://localhost:5000/api/predictions', {
      method: "post", 
      headers: {
        "Content-Type": "application/json"
      },
      // for req.body
      body: JSON.stringify({
        ticker,
        length,
        predictedPrice,
        initialPrice,
        time
      })
    })
    .then(res => {      
      if(res.ok) {        
        setPostSuccess(true) 
        return res.text()
      } 
    })
    .then(text => console.log("Posted JSON: " + text))
    .catch(error => console.log(error))
  }
  console.log("postSuccess: " + postSuccess)

  return(
    <div className="dashboard-component predictions"> 
      <h1>Make a Prediction</h1>
      <h3>Stock Symbol</h3>
      <input ref={stockTicker} type="text"/>
      <h3>Prediction Length (days)</h3>
      <input ref={predictionLength} type="number"/>
      <h3>Predicted Stock Price (USD)</h3>
      <input ref={predictionPrice} type="number"/>
      <button className="button" style={{margin: "1em 0"}} onClick={postPrediction}>Submit</button>
        {postSuccess
          ? <h3 className="success-msg">Success!</h3>
          : <></>
        }     
      {/* <p>{listOfPrices}</p> */}
    </div>
  )
}

export default Predictions