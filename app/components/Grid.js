import React, { Component } from 'react'
import GridSection from './GridSection'
import GenerationDisplay from './GenerationDisplay'
import styles from '../styles/styles.css'

//Grid keeps the state of each grid section, the number of generations, and any other addition settings.
//Grid sends data to GridSection to render.
//grid sends data to Counter to render generations.
//Grid sends data to Functional Components for processing.

class Grid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            grid: [],
            generation: 0,
            running: true,
            size: 40,
            gridHeight: 300,
            gridWidth: 440,
            aliveMax: 3,
            aliveMin: 2,
            deadNum: 3,
            speed: 350 
        }
    }
    gridMaker(size) {
        function randomGridSetter(){
            return Math.floor(Math.random()*3)
        }
        let newGrid = []
        for (var i = 0; i < size*size; i++) {
            newGrid.push(randomGridSetter())
        }
        this.setState({
            grid: newGrid
        });
    }
    getNeighbors(index) {
        let { grid } = this.state;
        let size = grid.length
        let rowLength = Math.pow(size, .5);    
        let neighbors = [];
        if (index > size){return []}
        //Conditions to check if it is either begging of row (0) or end of row (1) to process wrap around. shape of word is a column
        if(index%rowLength===0) {
            neighbors.push(index+1, index+rowLength,
            index-rowLength, index-rowLength+1, index+rowLength+1)
            //wrap around row
            neighbors.push(index+rowLength-1, index+rowLength*2-1, index-1)
        }
        else if(index%rowLength===9) {
            neighbors.push(index-1, index-rowLength, index-rowLength-1, index+rowLength-1, index+rowLength)
            //wrap around row
            neighbors.push(index-rowLength*2+1, index-rowLength+1,index+1)
        }
        else {
            neighbors.push(index+1, index-1, index-rowLength, index+rowLength,
            index-rowLength+1, index-rowLength-1, index+rowLength+1, index+rowLength-1)
        }
        return neighbors
    }
    generateGeneration() {
        let { grid } = this.state;
        let newGrid = [];
        newGrid = grid.slice()
        let that = this;
        //helper function to check each grid unit
        function unitChecker (index) {
            let neighbors = that.getNeighbors(index);
            let neighborsAlive = 0;
            neighbors.forEach(function(neighbor){
                if(grid[neighbor] > 0) {
                    neighborsAlive++
                }
            })
            //separate conditions if current cell is alive or dead
            if(grid[index] > 0) {
               if(neighborsAlive<that.state.aliveMin || neighborsAlive>that.state.aliveMax) {
                    newGrid[index] = 0;
                } else if (neighborsAlive>=that.state.aliveMin && neighborsAlive <=that.state.aliveMax) {
                    newGrid[index] = 2;
                }
            } else {
                if(neighborsAlive === that.state.deadNum) {
                    newGrid[index] = 1;
                } 
            }
        }
        grid.forEach(function(item, index) {
            unitChecker(index);
        })
        this.setState({
            grid: newGrid
        });
        if(this.state.running && this.state.grid.indexOf(1) + this.state.grid.indexOf(2) >= 0) {
            var repeat = setTimeout(()=>{this.generateGeneration(); this.setState({generation: 1+this.state.generation }) }, this.state.speed)
        } else if(this.state.grid.indexOf(1)+this.state.grid.indexOf(2) < 0) {
            this.onStartClick()    
        }
    }
    onStartClick() {
       if(this.state.running) {
            document.getElementById('start').innerHTML = "Start"
        } else { 
            document.getElementById('start').innerHTML = "Pause"
            setTimeout(()=>this.generateGeneration(), 1000) 
        }
       this.setState({
           running: !this.state.running
        }) 
    }
    onResetClick() {
        console.log("reset")
        this.setState({
            generation: 0,
        })
        this.gridMaker(this.state.size);
    }
    boardSize(direction){
            //for every 5 increase grid size needs to expand 100px in width and height
            if(direction ==="increase") {
                this.setState({
                    size: this.state.size + 5,
                    gridHeight: this.state.gridHeight + 30,
                    gridWidth: this.state.gridWidth + 55
                }) 
            document.getElementsByClassName('grid')[0].style.width = this.state.gridWidth+"px"
            document.getElementsByClassName('grid')[0].style.height = this.state.gridHeight+"px"
            } else {
                this.setState({
                    size: this.state.size - 5,
                    gridHeight: this.state.gridHeight - 30,
                    gridWidth: this.state.gridWidth - 55
                }) 
            document.getElementsByClassName('grid')[0].style.width = this.state.gridWidth+"px"
            document.getElementsByClassName('grid')[0].style.height = this.state.gridHeight+"px"
            }
            this.onResetClick()
    }
    onChange(event) {
        if (event.target.id === "aliveMax") {
            this.setState({
                aliveMax: event.target.value
            })
        }
        else if (event.target.id === "aliveMin") {
            this.setState({
                aliveMin: event.target.value
            })
        }
        else if (event.target.id === "deadNum") {
            this.setState({
                deadNum: Number(event.target.value)
            })
        }
        else if (event.target.id === "speed"){
            this.setState({
                speed: Number(event.target.value)
            }) 
        }
    }
    componentWillMount(){
        this.gridMaker(this.state.size); 
    }
    componentDidMount(){
        setTimeout(()=>{this.generateGeneration()}, 1000)
    }
    render() {
        
        return (
            <div className="grid">
                {this.state.grid.map((item,index) => <GridSection key={index} index={index} size={this.state.grid.length} item={item} />)}
                <GenerationDisplay generation={ this.state.generation } />
                <button id="start" onClick={()=>this.onStartClick()}>Pause</button>
                <button onClick={()=>this.onResetClick()}>Reset</button>
                <div>
                Board Size <br />
                <button id="increaser" onClick={()=>this.boardSize("increase")}>larger </button>
                <button id="decreaser" onClick={()=>this.boardSize("decrease")}>smaller</button>
                </div>
                <div>
                    <h3>Rules of the Game of Life:</h3>
                    <h4>If you're alive (red)</h4>
                    <p>If you have more than <input id="aliveMax" onChange={this.onChange.bind(this)} className="rulesInput" defaultValue={ this.state.aliveMax } /> or less than <input onChange={this.onChange.bind(this)} id="aliveMin" className="rulesInput" value= { this.state.aliveMin } /> neighbors alive you live in the next generation  </p>
                    <h4>If you're dead (grey/white)</h4>
                    <p>If you have exactly <input onChange={this.onChange.bind(this)} id="deadNum" className="rulesInput" value= { this.state.deadNum } /> neighbors that are alive you will be alive in the next generation</p>
                    <h4>Each generation lasts <input onChange={this.onChange.bind(this)} id="speed" className="rulesInput speed" value= { this.state.speed } /> milliseconds.</h4>
                </div>
            </div>
        )
    }
}

export default Grid
