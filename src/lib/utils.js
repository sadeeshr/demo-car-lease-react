/**
|--------------------------------------------------
| Utility functions 
|--------------------------------------------------
*/

class Console {
    log = (a, b, c, d, e, f) => window.openHood ? console.log(a ? a : '', b ? b : '', c ? c : '', d ? d : '', e ? e : '', f ? f : '') : ''
    errmsg = (code) => {
        switch (code) {
            case 11000:
                return "DUPLICATE ENTRY. Please check."
        
            default:
                break;
        }
    }
}

const cc = new Console();
export default cc;