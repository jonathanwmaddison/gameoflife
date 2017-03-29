import React from 'react'
import styles from '../styles/styles.css'
function GridSection(props) {
    const { item, size, index } = props;
    function checkRow (size, index) {
        if(index % Math.pow(size,.5) > 0) {
            return false
        }  else {
            return true
        }
     }
    if(checkRow(size, index)) {
      return (  
                <div className={"gridItem rowStart type"+item}>
                </div>
        )
    } else {
        return (
            <div className={"gridItem type" + item}>
            </div>
        )
    }
}

export default GridSection
