class TimeStampUTC {

    constructor() {

    }
    public getTimeStampUTC(): string {

        return `${this.getDateTime()}${this.getTimeZone()}`;

    }
    private getTimeZone() {
        let timezone_offset_min = new Date().getTimezoneOffset(),
            offset_hrs = parseInt(Math.abs(timezone_offset_min / 60).toString()).toString(),
            offset_min = Math.abs(timezone_offset_min % 60).toString(),
            timezone_standard;

        if (parseInt(offset_hrs) < 10)
            offset_hrs = '0' + offset_hrs;

        if (parseInt(offset_min) < 10)
            offset_min = '0' + offset_min;

        // Add an opposite sign to the offset
        // If offset is 0, it means timezone is UTC
        if (timezone_offset_min < 0)
            timezone_standard = '+' + offset_hrs + ':' + offset_min;
        else if (timezone_offset_min > 0)
            timezone_standard = '-' + offset_hrs + ':' + offset_min;
        else if (timezone_offset_min == 0)
            timezone_standard = '+0:00';


        return timezone_standard;
        

    }
    private getDateTime() {
        let dt = new Date(),
            current_date = dt.getDate().toString(),
            current_month = (dt.getMonth() + 1).toString(),
            current_year = dt.getFullYear().toString(),
            current_hrs = dt.getHours().toString(),
            current_mins = dt.getMinutes().toString(),
            current_secs = dt.getSeconds().toString(),
            current_millisecs = dt.getMilliseconds().toString(),
            current_datetime;

        // Add 0 before date, month, hrs, mins or secs if they are less than 0
        current_date = parseInt(current_date) < 10 ? '0' + current_date : current_date;
        current_month = parseInt(current_month) < 10 ? '0' + current_month : current_month;
        current_hrs = parseInt(current_hrs) < 10 ? '0' + current_hrs : current_hrs;
        current_mins = parseInt(current_mins) < 10 ? '0' + current_mins : current_mins;
        current_secs = parseInt(current_secs) < 10 ? '0' + current_secs : current_secs;
        if(current_millisecs.length < 3 && current_millisecs.length > 1)
            current_millisecs = '0'+ current_millisecs;
        else if(current_millisecs.length  < 2)
            current_millisecs = '00'+ current_millisecs;       
        current_millisecs = parseInt(current_millisecs) < 10 ? '00' + current_millisecs : current_millisecs;

        
        current_datetime = current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs +':'+current_millisecs;

        return current_datetime;

    }
}

export { TimeStampUTC }