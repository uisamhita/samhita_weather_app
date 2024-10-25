import loader from "../../assets/img/loader.gif";

const Loader = ({width}) => {
    return ( 
        <img src={loader} style={{width: `${width}px`}} />
     );
}
 
export default Loader;