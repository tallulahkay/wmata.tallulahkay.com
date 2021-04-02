function Maps(props) {
    return (
        props.visible && <img id={ props.id } src={props.source}></img>
    )
}