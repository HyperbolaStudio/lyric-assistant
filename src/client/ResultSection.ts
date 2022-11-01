import { circularProgress, queryCountField, resultError, resultList } from ".";

export namespace ResultSection{

    export function clearResult(){
        resultList.innerHTML = '';
        resultError.innerHTML = '';
        queryCountField.innerHTML = '';
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

    export function showQueryCount(count: number|string, actualCount: number, total: number, available: number){
        let s = `${count}请求，${actualCount}已获取，`
        if(total == -1){
            s += '每日可查询无限条。'
        }else{
            s += `每日可查询${total}条，今日剩余${available}条。`
        }
        queryCountField.textContent = s;
    }
}

