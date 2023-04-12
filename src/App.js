import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollcount, setcount] = React.useState(0)
    const [runtime, setruntime] = React.useState(0)
    const [playerdata, setplayerdata] = React.useState({})
    const[fromname,setfromname]= React.useState("")
    const[store,setstore]= React.useState([])
    const[besttime,setbesttime]= React.useState(0)
   
    
    React.useEffect(() => {
    localStorage.setItem('playerinfo',JSON.stringify([]))
    },[])
     function handlechange(event){
          setfromname(event.target.value)
          setruntime(pretime =>{ 
            let newtime = Date.now() 
        return newtime})
    }
    
        React.useEffect(() => {
        if(tenzies){
            setplayerdata(predata =>
                ({
                        ...predata,
                         count:rollcount,
                        time:runtime
                    }) 
            )
        }
    
    }, [tenzies])
    
    function currenttime(time){
        return time > 60 ? `${Math.floor(time/60)}m` : `${Math.round(time)}s`
    }
  
    React.useEffect(() => {
        
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setruntime(pretime =>{ 
            let newtime = (Date.now() - pretime)/1000
            
            return newtime})
            
        }
    }, [dice])

    function helper(array,obj){
        array.map(item => !(item.name === obj.name )? 
                         item : {
                                 ...item,
                                 count:obj.count,
                                 time:obj.time
                                } 
                              )
        return array  
    }
    
    function besttimes(time){
         setbesttime(
              time > 60 ? `${Math.floor(time/60)}m` : `${Math.round(time)}s`
                    )
    }
    
    React.useEffect(() => {
        console.log(playerdata.name)
       if(tenzies){
           setstore(predata => {
               let newdata =predata
                newdata = JSON.parse(localStorage.getItem('playerinfo'))
                console.log(newdata)
                let checktime = newdata.filter(item => item.name === playerdata.name)
                if(checktime[0]){
                    if(checktime[0].time > playerdata.time){
                        for(let i=0; i < newdata.length ; i++) {
                           if(newdata[i].name === playerdata.name){
                               newdata[i] ={
                                  name:playerdata.name,
                                  count:playerdata.count,
                                  time:playerdata.time
                              }
                           }
                        }  
                        besttimes(playerdata.time)
                    
                    }else{
                        besttimes(checktime[0].time)
                        }
                }else{
                  newdata.push(playerdata)    
                }
                return newdata           
           })
       }
    
   }, [playerdata])
   
   React.useEffect(() => {
       if(store[0]){
            console.log(store)
        localStorage.setItem('playerinfo',JSON.stringify(store))
       }
    
   },[store])

    React.useEffect(() => {
               setplayerdata(
                    ({
                       name:fromname,
                        count:rollcount,
                        time:runtime
                   })
               )
  
   }, [fromname])
 
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setcount(prevcount => prevcount +1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setcount(0)
            setruntime(0)
            setplayerdata({})
            setfromname("")
            setbesttime(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            {fromname == "" && <div className="input"><label htmlfor='player'>Player Name : </label>
            <input id="player" name="fromname" type="text" placeholder="Enter Name" onBlur={handlechange} /></div>}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">{tenzies && <div className='player-info'>
                                                    <h3>{`Player : ${playerdata.name}`}</h3>
                                                    <p><span>{`Current Time :` + currenttime(playerdata.time)}
                                                        </span>
                                                       <span>{`Best Time : ${besttime}`}</span>
                                                      </p>
                                                      <p> 
                                                       <span>{`Current Rollcount : ${playerdata.count}`}</span>
                                                    </p>
            
                                                  </div> ||
            <p>Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>}</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}