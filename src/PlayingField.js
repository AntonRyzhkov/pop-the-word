import React, {Component} from "react"
import Bubble from "./Bubble"
import { v1 } from 'uuid';
import {store} from "./content"
import {constants as C} from "./constansts"
import {randomGenerator, getRandomInt} from "./randoms"
import "./styles/PlayingField.css"

class PlayingField extends Component {
    constructor(props){
        super(props);
        this.store =[...store];        
        this.playTime = C.playTime;
        this.state = {
            set:[],
            trulyCounter:0,
            failedCounter:0,
            inProcess:false,
            currentTime:this.playTime,
        };        
        this.createBubble = this.createBubble.bind(this);
        this.disposeTarget = this.disposeTarget.bind(this);
        this.timerTick = this.timerTick.bind(this);
        this.startPlay = this.startPlay.bind(this);
        this.stopPlay = this.stopPlay.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.randomGenerator = randomGenerator(C.randomTopBound);
        this.getRandomInt = getRandomInt;
    }

    addToCurrentSet (target) {
        this.setState(({
            set:[
                ...this.state.set,
                target
            ],
        })
    )}

    removeFromCurrentSet(id){
        const set = this.state.set.filter(x=>id!==x.id);
        this.setState({set});
    }

    disposeTarget(target, clickd){
        if(clickd){
            if(target.props.correctness){ 
                this.handleCorrect(target);
            } else {
                this.handleWrong(target);
            }
        } else {
            this.removeFromCurrentSet(target.props.id);
        }
    }

    handleCorrect(target) {
        setTimeout(()=>{
            this.removeFromCurrentSet(target.props.id);
            target.componentWillUnmount();
        }, C.timeToCorrectMoveOut);
        this.setState(state=>state.trulyCounter++);
        target.setState({
            className:target.state.className + " truly",            
        });
    }

    handleWrong(target) {       
        setTimeout(()=>{
            this.removeFromCurrentSet(target.props.id);
            target.componentWillUnmount();
        }, C.timeToWrongMoveOut);
        this.setState(state=>state.failedCounter++);
        target.setState({
            className:target.state.className + " failed", 
            hitUncorrect:true
        });
    }

    handleStart(){
        if(this.state.inProcess) {
            this.setState({
                set:[],
                trulyCounter:0,
                failedCounter:0, 
                currentTime:this.playTime               
            });
            this.handleStop();
        } else {
            this.startPlay();
        }
    }

    handleStop() {
        clearInterval(this.fabric);
        clearInterval(this.timer);
        clearInterval(this.timeout);
        this.setState({inProcess:false});
    }

    startPlay(){     
        this.stopPlay();
        this.setState({
            set:[],
            counter:0,
            inProcess:true,            
        });    
        this.fabric = setInterval(this.createBubble, C.createPopInterval);
        this.timer = setInterval(this.timerTick, C.timerStep);
        const timeToStop = ()=> {
            this.stopTimer = setInterval(this.stopPlay, 100);
        }
        this.timeout = setTimeout(timeToStop, this.playTime);
    }

    stopPlay(){ 
        clearInterval(this.fabric);       
        if(this.state.set.length === 0){
            this.handleStop();
            clearInterval(this.stopTimer);
            this.setState({currentTime:this.playTime})
        }
    }

    getWordFromStore(){
        const index = this.getRandomInt(this.store.length - 1);
        const word = this.store[index];
        delete this.store[index];
        this.store = this.store.filter(item=>item!==undefined);        
        return word;
    }

    timerTick() {
        if(this.state.currentTime >= C.timerStep){
            this.setState({currentTime:this.state.currentTime - C.timerStep});
        }
        
    }

    createBubble(){
        const wordObj = this.getWordFromStore();
        return this.addToCurrentSet({
            word: wordObj.display,
            correctness:wordObj.truly,
            position:{
                x: this.randomGenerator.next().value,
                y:0
            },
            id: v1(),
            tip: wordObj.displayCorrect,
        });
    }

    render() {
        const {handleStart} = this;
        const {trulyCounter, failedCounter, inProcess, currentTime} = this.state;
        return (             
            <div>                 
                <div className="counter">
                    <h3>{trulyCounter}</h3>
                </div>  
                <div className="counterfailed">
                    <h3>{failedCounter}</h3>
                </div>  
                <button className={"text stopButton"} onClick={handleStart}>{inProcess?"stop":""}</button> 
                <div className="field">
                    {
                        [...this.state.set].map(bubble =>
                            (<Bubble key={bubble.id} disposeMe={this.disposeTarget} {...bubble} />)) 
                    }
                </div>
                <div className="timer">
                    <h2>{currentTime}</h2>
                </div>               
                {
                    inProcess
                    ?null
                    :<div className="playMask"><div className="playButton" onClick={handleStart}></div></div>
                }
            </div>
        )
    }
}

export default PlayingField