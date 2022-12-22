
import value from './../../mockData/api-usage.json';
import { DataForApiCallsGraphInterface, DataForApiCallsPerKeysGraphInterface, DetailedApiCallsInterface, TotalApiCallsInterface } from './interface';

export const getData = ():TotalApiCallsInterface =>{
      
        return value;
      
}

export const getDataForChart = (currentMonth:DetailedApiCallsInterface[] , previousMonth:DetailedApiCallsInterface[] ) =>
{
    const days: string[] = []
    for (let i = 1; i <= 31; i++) {
        if (i < 10)
            days.push(`0${i}`);
        else
            days.push(`${i}`);
    }
    const labels: string[] = days;

    return  {
        labels,
        datasets: [
            {
                label: 'this month',
                data: currentMonth.map((e: DetailedApiCallsInterface) => parseInt(e.totalCalls)),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'last month',
                data: previousMonth.map((e: DetailedApiCallsInterface) => parseInt(e.totalCalls)),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
    
}
export const getDaysInAMonth = (year:number,month:number) =>{
   
             return new Date(year,month,0).getDate() 
             
}

export const getDataForThisAndPreviousMonth =  (currentDay:string,currentMonth:string,previousMonth:string,currentYear:string, data:any) => {
               
            
            const dataForApiCallsGraph:DataForApiCallsGraphInterface = {} as DataForApiCallsGraphInterface;
            const currentMonthData:DetailedApiCallsInterface[] =  data.filter((e:DetailedApiCallsInterface) => ( e.month === currentMonth && e.year === currentYear ));
            const previousMonthData:DetailedApiCallsInterface[] =  data.filter((e:DetailedApiCallsInterface) => ( e.month === previousMonth && e.year === currentYear) );
            
            const currentMonthByKeyDataSort:DetailedApiCallsInterface[] = currentMonthData.slice().sort((a:DetailedApiCallsInterface,b:DetailedApiCallsInterface) =>
                                                   a.key.localeCompare(b.key)
            ).slice();
           
            const pastMonthByKeyDataSort:DetailedApiCallsInterface[] = previousMonthData.slice().sort((a:DetailedApiCallsInterface,b:DetailedApiCallsInterface) =>
                        a.key.localeCompare(b.key)
            ).slice(); 

            const previousMonthByDayDataSort:DetailedApiCallsInterface[] =  previousMonthData.sort((a:DetailedApiCallsInterface,b:DetailedApiCallsInterface) =>
                           a.day.localeCompare(b.day)
            ).slice();
            
            const currentMonthByDayDataSort:DetailedApiCallsInterface[] =  currentMonthData.slice().sort((a:DetailedApiCallsInterface,b:DetailedApiCallsInterface) =>
                                                 a.day.localeCompare(b.day)
            ).slice();
            
            let count:number = 0;
            let runningMonth:number = 0;
            let runningDay = 0;
            let runningDayCost = 0;
            let runningMonthCost = 0;

            const dataForApiCallsPerKeysGraphArray:DataForApiCallsPerKeysGraphInterface[] = [];

            let dataForApiCallsPerKeysGraph:DataForApiCallsPerKeysGraphInterface = {} as DataForApiCallsPerKeysGraphInterface;
                dataForApiCallsPerKeysGraph.month = "0";
                dataForApiCallsPerKeysGraph.todayCount ="0"
            
            
            for(let i = 0; i < currentMonthByKeyDataSort.length; )
            {
                  
                    if(currentMonthByKeyDataSort[0].key === currentMonthByKeyDataSort[i].key)
                    {
                       
                        if(currentMonthByKeyDataSort[i].day === currentDay)
                        {
                           dataForApiCallsPerKeysGraph.todayCount = currentMonthByKeyDataSort[i].totalCalls;
                           runningDay += parseInt(currentMonthByKeyDataSort[i].totalCalls);
                           runningDayCost += ( runningDay * parseFloat(currentMonthByKeyDataSort[i].apiCostPerCall.apiCostPerCall) );
                        } 
                        
                          
                        dataForApiCallsPerKeysGraph.key = currentMonthByKeyDataSort[i].key;                         
                        count +=  parseInt(currentMonthByKeyDataSort[i].totalCalls);
                        runningMonthCost += (parseInt(currentMonthByKeyDataSort[i].totalCalls) * parseFloat(currentMonthByKeyDataSort[i].apiCostPerCall.apiCostPerCall))
                      
                        if( i === (currentMonthByKeyDataSort.length - 1))
                        {
                            
                            dataForApiCallsPerKeysGraph.month = count.toString();
                            runningMonth += count;
                            if(Object.keys(dataForApiCallsPerKeysGraph).length > 0)
                               dataForApiCallsPerKeysGraphArray.push(dataForApiCallsPerKeysGraph);
                            currentMonthByKeyDataSort.splice(0, i ); i = 0;
                            count = 0;
                            
                        }
                        i++;  
                    }
                     else
                     {
                        dataForApiCallsPerKeysGraph.month = count.toString();
                        runningMonth += count;
                        if(Object.keys(dataForApiCallsPerKeysGraph).length > 0)
                           dataForApiCallsPerKeysGraphArray.push(dataForApiCallsPerKeysGraph);
                        currentMonthByKeyDataSort.splice(0, i ); 
                        i = 0;
                        count = 0;
                        dataForApiCallsPerKeysGraph = {} as DataForApiCallsPerKeysGraphInterface;
                        dataForApiCallsPerKeysGraph.month = "0";
                        dataForApiCallsPerKeysGraph.todayCount ="0"
                     }    
            }
            
            
            dataForApiCallsGraph.sumOfCurrentMonthApiCalls = runningMonth.toString();
            dataForApiCallsGraph.sumOfCurrentDayApiCalls =  runningDay.toString();
            dataForApiCallsGraph.sumOfCurrentDayEstimatedCost =runningDayCost.toFixed(2).toString();
            dataForApiCallsGraph.sumOfCurrentMonthEstimatedCost = runningMonthCost.toFixed(2).toString();
            dataForApiCallsGraph.dataForApiCallsPerKeysGraphInterface = dataForApiCallsPerKeysGraphArray;

            let runningPreviousMonthDay:number = 0; 
            for(let i = 0; i < pastMonthByKeyDataSort.length; )
            {
                  
                    if(pastMonthByKeyDataSort[0].key === pastMonthByKeyDataSort[i].key)
                    {
                       
                        if(pastMonthByKeyDataSort[i].day === currentDay)
                        {
                            runningPreviousMonthDay += parseInt(pastMonthByKeyDataSort[i].totalCalls);
                           
                        }                      
                        i++;  
                    }
                     else
                     {
                        i = 0;
                     }    
            }
            dataForApiCallsGraph.sumOfPastMonthApiCalls = runningPreviousMonthDay.toString();
            let runningCountLastMonth:number = 0; 
            count = 0;
            
            const detailedApiCallsPreviousMonthArray:DetailedApiCallsInterface[] = [];
            let detailedApiCallsDay:DetailedApiCallsInterface = {} as DetailedApiCallsInterface;
            detailedApiCallsDay.month = "0";
            detailedApiCallsDay.totalCalls ="0";
                        
            for(let i = 0; i < previousMonthByDayDataSort.length;)
            {
                     
                    if(previousMonthByDayDataSort[0].day === previousMonthByDayDataSort[i].day)
                    {  
                        detailedApiCallsDay.day = previousMonthByDayDataSort[i].day;
                        detailedApiCallsDay.month =previousMonthByDayDataSort[i].month;
                        detailedApiCallsDay.year = previousMonthByDayDataSort[i].year;                                 
                        count +=  parseInt(previousMonthByDayDataSort[i].totalCalls);
                        runningCountLastMonth += parseInt(previousMonthByDayDataSort[i].totalCalls);
                        
                        
                        if(i === (previousMonthByDayDataSort.length - 1))
                        {
                            detailedApiCallsDay.totalCalls = count.toString();
                            if(Object.keys(detailedApiCallsDay).length > 0)
                               detailedApiCallsPreviousMonthArray.push(detailedApiCallsDay);
                            previousMonthByDayDataSort.splice(0, i ); 
                            i = 0;
                            count = 0;
                           
                        }
                        i++;
                    }
                     else
                     {
                        detailedApiCallsDay.totalCalls = count.toString();
                        if(Object.keys(detailedApiCallsDay).length > 0)
                           detailedApiCallsPreviousMonthArray.push(detailedApiCallsDay);
                        previousMonthByDayDataSort.splice(0, i); 
                        i = 0;
                        count = 0;
                        detailedApiCallsDay = {} as DetailedApiCallsInterface;
                        detailedApiCallsDay.month = "0";
                        detailedApiCallsDay.totalCalls ="0";
                     }    
            } 
            
            dataForApiCallsGraph.sumOfPastMonthApiCalls = runningCountLastMonth.toString();
            dataForApiCallsGraph.sumOfPastDayMonthApiCalls = runningPreviousMonthDay.toString();
            const detailedApiCallsCurrentMonthArray:DetailedApiCallsInterface[] = [];
            detailedApiCallsDay = {} as DetailedApiCallsInterface;
            detailedApiCallsDay.month = "0";
            detailedApiCallsDay.totalCalls ="0";
            
            for(let i = 0; i < currentMonthByDayDataSort.length;)
            {

                
                    if(currentMonthByDayDataSort[0].day === currentMonthByDayDataSort[i].day)
                    {
                          
                        detailedApiCallsDay.day = currentMonthByDayDataSort[i].day;
                        detailedApiCallsDay.month = currentMonthByDayDataSort[i].month;
                        detailedApiCallsDay.year = currentMonthByDayDataSort[i].year;                                 
                        count +=  parseInt(currentMonthByDayDataSort[i].totalCalls);
                        runningCountLastMonth += parseInt(currentMonthByDayDataSort[i].totalCalls);
                    
                        if(i === (currentMonthByDayDataSort.length - 1))
                        {
                            detailedApiCallsDay.totalCalls = count.toString();
                            if(Object.keys(detailedApiCallsDay).length > 0)
                               detailedApiCallsCurrentMonthArray.push(detailedApiCallsDay)
                            currentMonthByDayDataSort.splice(0, (i + 1)); i = 0;
                            count = 0;
                        }
                        i++; 
                    }
                     else
                     {
                        detailedApiCallsDay.totalCalls = count.toString();
                        if(Object.keys(detailedApiCallsDay).length > 0)
                           detailedApiCallsCurrentMonthArray.push(detailedApiCallsDay)
                        currentMonthByDayDataSort.splice(0, i ); 
                        i = 0;
                        count = 0;
                        detailedApiCallsDay = {} as DetailedApiCallsInterface;
                        detailedApiCallsDay.month = "0";
                        detailedApiCallsDay.totalCalls ="0";

                     }    
            } 
           
            dataForApiCallsGraph.graphData = getDataForChart(detailedApiCallsCurrentMonthArray,detailedApiCallsPreviousMonthArray)
            
            return dataForApiCallsGraph; 

}



