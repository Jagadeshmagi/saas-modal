import React from 'react'
import {Cell} from 'fixed-data-table'
import {Button, Col, Overlay, OverlayTrigger, Popover,Glyphicon} from 'react-bootstrap'
//import image from 'assets/gear.png'

export default class ColumnChooserClass extends React.Component{
  constructor(props) {

    super(props);

    this.state = {
    };
  }

  handleChange(e){
    this.props.changeHandler(e.target.id)
  }

  render() {
    let style = {
        //...this.props.style,
        left:'1000px',
        position: 'absolute',
        maxWidth:'100%',
        backgroundColor: '#FFF',
        borderRadius: 5,
        width: 180,
        zIndex: 99,
        fontSize: 14,
        marginTop:14
    }
    let userOptionsPopover = (
       <Popover style={style}
          arrowOffsetLeft={70}
          placement="bottom" id="popover-trigger-click-root-close">
         <div>
            { this.props.columnsList.map((item) =>
              { return  (
                <div className='tableWrapper' style={{marginTop:'5px'}} key={item.name}>
                  <input type='checkbox' id={item.name} defaultChecked={item.show} onChange={this.handleChange.bind(this)}/>
                  <label style={{fontWeight: 400}}htmlFor={item.name}> {item.displayText}</label>
                </div>
              )}
            )}
         </div>
       </Popover>
       )
    return (
      <div style={{position: 'relative'}}>
        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={userOptionsPopover}>
              <a ref="chooserLink"  style={{fontSize:'24px'}} onClick={this.props.toggle}>
                <img src="/images/gear.png" style={{backgroundColor:'white'}} height="22px" width="22px" />
              </a>
        </OverlayTrigger>
      </div>
    )
  }
}
