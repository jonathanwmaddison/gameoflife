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
            running: true
        }
    }
    gridMaker(size) {
        function randomGridSetter(){
            return Math.floor(Math.random()*3)
        }
        this.setState({
            grid: []
        })
        for (var i = 0; i < size; i++) {
            this.state.grid.push(randomGridSetter())
        }
        this.setState({
            grid: this.state.grid
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
            console.log(index)
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
            this.setState({
                generation: "Life is extinct :("
            })
        }
    }
    componentWillMount(){
        this.gridMaker(100); 
    }
    componentDidMount(){
        setTimeout(()=>{this.generateGeneration()}, 1000)
    }
    render() {
        
        return (
            <div className="grid">
                {this.state.grid.map((item,index) => <GridSection index={index} size={this.state.grid.length} item={item} />)}
                <GenerationDisplay generation={ this.state.generation } />
            </div>
        )
    }
}

export default Grid
