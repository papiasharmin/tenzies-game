import React from "react"
import Dot from './dot'
export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    let dotarray =[]
    for(let i=0; i < props.value; i++){
       dotarray.push(<Dot/>) 
    }  
    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            
            {dotarray}
        </div>
    )
}