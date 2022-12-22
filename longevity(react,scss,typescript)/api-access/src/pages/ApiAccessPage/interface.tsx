interface ApicostPerCallInterface {
    apiCostPerCall:string;
}
export interface DetailedApiCallsInterface{
       day:string;
       month:string;
       year:string;
       totalCalls:string;
       key:string;
       apiCostPerCall:ApicostPerCallInterface;
}

export interface TotalApiCallsInterface{
    data:DetailedApiCallsInterface[];
}

export interface DataForApiCallsPerKeysGraphInterface {
        key:string;
        todayCount:string,
        month:string
} 

export interface DataForApiCallsGraphInterface {
    sumOfCurrentMonthApiCalls:string,
    sumOfPastMonthApiCalls:string,
    sumOfPastDayMonthApiCalls:string;
    sumOfCurrentDayApiCalls:string,
    sumOfCurrentDayEstimatedCost:string;
    sumOfCurrentMonthEstimatedCost:string;
    dataForApiCallsPerKeysGraphInterface:DataForApiCallsPerKeysGraphInterface[];
    graphData:any;
}



