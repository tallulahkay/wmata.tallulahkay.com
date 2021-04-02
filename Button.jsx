function Button(props) {
    
    function isLine(color) {
        return [props.station.LineCode1, props.station.LineCode2, props.station.LineCode3, props.station.LineCode4].some(lineCode => lineCode == color)
        
    }
    function buttonColorBasedOnLine() {
        if (props.line) {
            if (props.line.LineCode == "BL") {
                return 'blue'
            } else if (props.line.LineCode == "GR") {
                return 'green'
            } else if (props.line.LineCode == "OR") {
                return 'orange'
            } else if (props.line.LineCode == "RD") {
                return 'red'
            } else if (props.line.LineCode == "SV") {
                return 'silver'
            } else if (props.line.LineCode == "YL") {
                return 'yellow'
            }
            else {
                return '#F5F5F5';
            }   
        } else if (props.station) {
            let color = '#F5F5F5'
            if (isLine("RD")) {
                color = 'red'
            } if (isLine("OR")) {
                color = 'orange'
            } if (isLine("GR")) {
                color = 'green'
            } if (isLine("YL")) {
                color = 'yellow'
            } if (isLine("BL")) {
                color = 'blue'
            } if (isLine("SV")) {
                color = 'silver'
            } if (isLine("BL") && isLine("YL")) {
                color = 'linear-gradient(145deg, yellow 50%, blue 50%)'
            }  if (isLine("BL") && isLine("SV")) {
                color = 'linear-gradient(145deg, blue 50%, silver 50%)'
            } if (isLine("BL") && isLine("YL")) {
                color = 'linear-gradient(145deg, yellow 50%, blue 50%)'
            } if (isLine("GR") && isLine("YL")) {
                color = 'linear-gradient(145deg, yellow 50%, green 50%)'
            } if (isLine("BL") && isLine("SV") && isLine("OR")) {
                color = 'linear-gradient(145deg, silver 33%, blue 33%, blue 66%, orange 66%)'
            }
            return color
        }
    }
    
    const buttonEnabledStyle = {
        color: '#040B10',
        textTransform: 'uppercase',
        textDecoration: 'none',
        background: '#F5F5F5',
        padding: '3px',
        fontSize: '12px',
        display: 'inline-block',
        transition: 'all 0.4s ease 0s',
        opacity: 1,
        borderRadius: '6px',
        fontWeight: 'bold'
    };
    
    const buttonDisabledStyle = {
        ...buttonEnabledStyle,
        opacity: 0.45
    };
     
    const buttonClickedStyle = {
          ...buttonEnabledStyle,
    }
    
    let borderStyle = {
        display:'inline-block', 
        padding: '2px', 
        background: buttonColorBasedOnLine(), 
        borderRadius: '6px', 
        margin: '2px'
    }
    
    let borderDisabledStyle = {
        ...borderStyle,
        background: 'white'
    }
    
    function borderEnabled() {
        if (buttonEnabled() == buttonEnabledStyle) {
            return true
        } else if (buttonEnabled() == buttonDisabledStyle) {
            return false
        } else if (buttonEnabled() == buttonClickedStyle) {
            return true
        }
    }

    function buttonEnabled() {
        if (props.currentLine.LineCode == "" && props.currentStation.Code == "") {
            return buttonEnabledStyle
        } else if (props.type == "line" && props.line.LineCode != "") {
            if (props.currentLine.LineCode == props.line.LineCode) {
                return buttonClickedStyle
            } else if (props.currentStation.LineCode1 == props.line.LineCode || props.currentStation.LineCode2 == props.line.LineCode || props.currentStation.LineCode3 == props.line.LineCode || props.currentStation.LineCode4 == props.line.LineCode) {
                return buttonEnabledStyle
            }
            else {
                return buttonDisabledStyle
            }
        } else if (props.type == "station" && props.station.Code != "") {
            if (props.currentStation.Name == props.station.Name) {
                return buttonClickedStyle
            } else if (props.station.LineCode1 == props.currentLine.LineCode || props.station.LineCode2 == props.currentLine.LineCode || props.station.LineCode3 == props.currentLine.LineCode || props.station.LineCode4 == props.currentLine.LineCode) {
                return buttonEnabledStyle
            } else {
                return buttonDisabledStyle    
            }
        }
    }

    return  (
        <div style={ borderEnabled() ? borderStyle : borderDisabledStyle }>
            <button 
                className="customButton"
                style={ buttonEnabled() }
                onClick={ props.onClick }>
                    { props.name }
            </button>
        </div>
    )
}