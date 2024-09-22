import axios from "axios";


export const axiosService_GET = async (request: any) => {
    try {
        const response: any = await axios(request)
        return response.data;
    } catch (e) {
        throw new Error(`${e}`);
    }
}