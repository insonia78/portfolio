import { axiosService_GET } from "services/axiosService"
import { configurationData } from "services/configurationFileService";

export const getDataFromFakerApi: any = async () => {
    if (!configurationData['yaml'])
        throw new Error(`CONFIGURATION NOT PRESENT`);;
    const request = {
        method: 'get',
        url: `${await configurationData['yaml']['api']['uri']}/${await configurationData['yaml']['api']['path']}`,       
    }

    try {
        return (await axiosService_GET(request)).data;
    } catch (e) {
        throw new Error(`${e}`);
    }

}