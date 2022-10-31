import { circularProgress, resultError, resultList } from ".";

export namespace ResultSection{

    export function clearResult(){
        resultList.innerHTML = '';
        resultError.innerHTML = '';
        CircularProgress.hide();
    }

    export namespace CircularProgress{
        export function show(){
            circularProgress.style.display = 'block';
        }
        export function hide(){
            circularProgress.style.display = 'none';
        }
    }

    export function showError(e: any){
        resultError.textContent = e.toString();
    }
}

