import React, { Component } from 'react';
import {constants as C} from "./constansts"
import "./styles/Bubble.css"

class Bubble extends Component {
    constructor(props){
        super(props);
        this.state = {
            x:props.position.x,
            y:props.position.y,
            className: "bubble",            
            hitUncorrect:false,
        }
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.interval = setInterval(() => this.tick(), C.popMoveInterval);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this._isMounted = false;
    }

    tick() {
        if(this.state.y > C.popHideLimit) {
            clearInterval(this.interval);
            this.props.disposeMe(this, false);
        }
        if(this._isMounted){
            this.setState(state => ({               
                y: state.y + C.popMoveStep,
            }));
        }
    }

    render() {
        const {x,y,color, hitUncorrect, className} = this.state;    
        const {word, tip} = this.props;
        const st = {
            left:`${x}%`,
            top:`${y}%`,            
            background:color,           
        };
        const display = hitUncorrect? tip: "";
        return (
            <button className={className} onMouseDown={()=>this.props.disposeMe(this, true)}  style={st}>               
                {
                hitUncorrect
                ?<div className={"text" + (hitUncorrect? " tip": "")}>{display}</div>
                :null
                }
                <span className={"text" + (hitUncorrect? " strike": "")}>{word}</span>
            </button>
        )
    }
}

export default Bubble