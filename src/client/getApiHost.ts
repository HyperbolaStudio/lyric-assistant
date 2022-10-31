import { apiHost, apiUriForm, useThirdPartyApiCheckbox } from ".";

export function getApiHost(){
    if(useThirdPartyApiCheckbox.selected){
        return apiUriForm.value;
    }else{
        return apiHost;
    }
}