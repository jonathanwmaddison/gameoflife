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
            size: 20,
            gridSize: 400
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
            //seperate conditions if current cell is alive or dead
            if(grid[index] > 0) {
               if(neighborsAlive<2 || neighborsAlive>3) {
                    newGrid[index] = 0;
                } else if (neighborsAlive>=2 && neighborsAlive <=3) {
                    newGrid[index] = 2;
                }
            } else {
                if(neighborsAlive === 3) {
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
            var repeat = setTimeout(()=>{this.generateGeneration(); this.setState({generation: 1+this.state.generation }) }, 500)
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
                    gridSize: this.state.gridSize + 100
                }) 
            document.getElementsByClassName('grid')[0].style.width = this.state.gridSize+"px"
            document.getElementsByClassName('grid')[0].style.height = this.state.gridSize+"px"
            } else {
                this.setState({
                    size: this.state.size - 5,
                    gridSize: this.state.gridSize - 100
                }) 
            document.getElementsByClassName('grid')[0].style.width = this.state.gridSize+"px"
            document.getElementsByClassName('grid')[0].style.height = this.state.gridSize+"px"
            }
            this.onResetClick()
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
            </div>
        )
    }
}

export default Grid
