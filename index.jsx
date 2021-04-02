const { useEffect, useState } = React

function App() {
    
    const initialLine = {
        DisplayName: "",
        EndStationCode: "",
        InternalDestination1: "",
        InternalDestination2: "",
        LineCode: "",
        StartStationCode: "",
    }
    
    const initialStation = { 
        Address: {
            Street: "", 
            City: "", 
            State: "", 
            Zip: ""
        },
        Code: "",
        Lat: 0,
        LineCode1: "",
        LineCode2: "",
        LineCode3: "",
        LineCode4: "",
        Lon: 0,
        Name: "",
        StationTogether1: "",
        StationTogether2: ""
    }
    
    const initialState = { 
        lines: [], 
        stations: [], 
        currentLine: initialLine, 
        currentStation: initialStation,
        upcomingTrains: [] 
    }

    const [ state, setState ] = useState(initialState)

    const params = {
        "api_key": "b51da494fb50465eab1377ee47b27dfe"
    }
    
    function isMismatch(station, line) {
        if (!(station.LineCode1 == line.LineCode || station.LineCode2 == line.LineCode || station.LineCode3 == line.LineCode || station.LineCode4 == line.LineCode)) {
            return true
        } else {
            return false
        }
    }
    
    function showTrains(train) {
        if (state.currentLine.LineCode == "") {
            return true
        }
        else {
            return state.currentLine.LineCode == train.Line
        }
    }
    
    function visible(color) {
        if (color == "transparent") {
            return true
        }
        return state.currentLine.LineCode == color || state.currentStation.LineCode1 == color || state.currentStation.LineCode2 == color || state.currentStation.LineCode3 == color || state.currentStation.LineCode4 == color
    }
    
    useEffect(() => {
        fetch("https://api.wmata.com/Rail.svc/json/jStations", { headers: params })
        .then(res => res.json())
        .then((data) => {
            setState(prevState => ({
                ...prevState,
                stations: data.Stations
            }))
            console.log("success") 
        }, (error) => {
                console.log(error)
        }, []) 
    }, [state.currentStation])
    
    
    useEffect(() => {
        fetch("https://api.wmata.com/Rail.svc/json/jLines?", { headers: params })
        .then(res => res.json())
        .then((data) => {
            setState(prevState => ({
                ...prevState,
                lines: data.Lines
            }))
            console.log("success")
        }, (error) => {
            console.log(error)
        }, [])
    }, [state.currentLine])
    
    useEffect(() => {
        if (state.currentStation.Code != "") {
            fetch("https://api.wmata.com/StationPrediction.svc/json/GetPrediction/" + state.currentStation.Code, { headers: params })
            .then(res => res.json())
            .then((data) => {
                setState(prevState => ({
                    ...prevState,
                    upcomingTrains: data.Trains
                }))
                console.log("success")
            },
            (error) => {
                console.log(error)
            })
        }
    }, [state.currentLine, state.currentStation])
    
    return  (
        <div>
                <h1>WMATA Trip Planner</h1>
                <div className="top-content">
                    <ul id="left">
                        {
                            state.lines.map((line, index) => (
                                <Button 
                                    key={index}
                                    type={"line"}
                                    line={line}
                                    currentLine={state.currentLine}
                                    currentStation={state.currentStation}
                                    name={line.DisplayName}
                                    onClick={() => {
                                        if (isMismatch(state.currentStation, line)) {
                                            setState(prevState => ({
                                            ...prevState,
                                            currentStation: initialStation,
                                            currentLine: line
                                        }))} else {
                                            setState(prevState => ({
                                            ...prevState,
                                            currentLine: line
                                        }))}
                                    }}
                                />
                            ))
                        }
                    </ul>
                    <ul id="right">
                        {
                            state.stations.map((station, index) => (
                                <Button 
                                    key={index} 
                                    type={"station"}
                                    station={station}
                                    currentLine={state.currentLine}
                                    currentStation={state.currentStation}
                                    name={station.Name}
                                    onClick={() => {
                                    if (isMismatch(station, state.currentLine)) {
                                            setState(prevState => ({
                                            ...prevState,
                                            currentStation: station,
                                            currentLine: initialLine
                                        }))} else {
                                            setState(prevState => ({
                                            ...prevState,
                                            currentStation: station
                                        }))}
                                    }}
                                />
                            ))
                        }
                    </ul>
                </div>
                <div className="bottom-content">
                    <div id="info">
                        <b><div>{state.currentStation.Name}</div></b>
                        <div>{state.currentStation.Address.Street}</div>
                        <div>{state.currentStation.Address.City == "" ? "Select a station to get information about the station and train arrival times." : state.currentStation.Address.City + ', ' + state.currentStation.Address.State + ', ' + state.currentStation.Address.Zip}</div>
                        <b><div id="upcoming-title">
                            { state.currentStation.Name != "" ? (state.upcomingTrains.length == 0 ? "There are no upcoming trains for this selection." : "Upcoming Trains: ") : "" } 
                        </div></b>
                        <ul id="trains">
                            {
                                state.upcomingTrains.map((train, index) => (
                                    showTrains(train) && 
                                    <li className="upcoming-trains" key={index}>
                                        {train.DestinationName} {train.Min} {train.Min != "BRD" && train.Min != "ARR" && <span>mins</span>}
                                    </li> 
                                ))
                            }
                        </ul>
                    </div>
                    <div id="map">
                        <Maps visible={ visible("transparent") } id={ "transparentMap" } source={ "transparentmap.png" } />
                        <Maps visible={ visible("BL") } id={ "blueMap" } source={ "blue.png" } />
                        <Maps visible={ visible("RD") } id={ "redMap" } source={ "red.png" } />
                        <Maps visible={ visible("SV") } id={ "silverMap" } source={ "silver.png" } />
                        <Maps visible={ visible("YL") } id={ "yellowMap" } source={ "yellow.png" } />
                        <Maps visible={ visible("GR") } id={ "greenMap" } source={ "green.png" } />
                        <Maps visible={ visible("OR") } id={ "orangeMap" } source={ "orange.png" } />
                    </div>
                </div>
            </div>
            )
}

ReactDOM.render(<App />, document.getElementById('root'))
