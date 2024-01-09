// Will get u_id, name 
// Only requires to send frend request 

import * as React from 'react';


const Popup = (props) => {
  state={
    likeList:''
  }
  renderLikeList = () =>{
    return <div className="likes__list" >Likes to be rendered specifically <input type= "button"/></div>
    
  }
  handleLeave=()=>{
    return this.setState({likeList:''})
  }
  handleHover=()=>{
    return this.setState({likeList:this.renderLikeList()})
  }
 
    return(
      <div className="likes__wrapper" >
        <div className="likes__relavance" onMouseOver={this.handleHover} onMouseLeave={this.handleLeave}>
          Hover me
          {this.state.likeList}
        </div>
      </div>
    )
  
}