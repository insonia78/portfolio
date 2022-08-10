/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Scenario_and_Cases_data_bucket = function ()
{
    this.bucket;
    this.name = "Scenario_and_Cases_data_bucket";
    this.temp_bucket = [];
    this.ERROR = -1;
    this.SUCCESS = 1;
};
Scenario_and_Cases_data_bucket.prototype.setToTempBucket = function (data)
{
    console.log(this.name + " >> setting to temp Bucket");
    this.temp_bucket.push(data);
    console.log(data);
};
Scenario_and_Cases_data_bucket.prototype.DeleteFromBucket = function (scenario, _case)
{
    console.log(this.name + " >> Deleting From Bucket" + _case);
    var index = searchScenario(scenario, this.bucket);
    var z = -1;
    var temp = [];
    console.log("before deleting");
    for (var e = 0; e < this.bucket[index].cases.length; e++)
    {
        console.log(this.bucket[index].cases[e].case);
    }
    if (_case === "" || typeof _case === 'undefined')
    {
        for (var i = 0; i < this.bucket.length; i++)
        {
            ++z;
            if (i === index)
            {
                --z;
                continue;
            } else
                temp[z] = this.bucket[i];

        }
        this.bucket = temp;
        return this.SUCCESS;
    }
    var case_index = searchCase(this.bucket[index].cases, _case);

    console.log("case_index " + case_index);
    for (var b = 0; b < this.bucket[index].cases.length; b++)
    {
        ++z;
        if (b === case_index)
        {
            console.log(" removing " + this.bucket[index].cases[case_index].case);
            --z;
            continue
        } else
        {
            console.log(this.bucket[index].cases[case_index].case + ":" + this.bucket[index].cases[b].case);
            temp[z] = this.bucket[index].cases[b];
        }

    }
    console.log(this.name + " deleting boundry condition >> " + this.bucket[index].cases.length);
    if (this.bucket[index].cases.length === 1)
    {
        console.log(this.name + " deleting boundry condition ");
        var k = -1;
        var tempBucket = [];
        console.log(this.name + " length " + this.bucket.length);
        for (var a = 0; a < this.bucket.length; a++)
        {
            ++k;
            console.log(a + ":" + index + ":" + k);
            if (a === index)
            {
                console.log("deleting");
                --k;
                continue
            } else
            {
                tempBucket[k] = this.bucket[a];

            }

        }
        this.bucket = quickSortScenario(tempBucket, 0, tempBucket.length - 1);

    } else
    {
        this.bucket[index].cases = temp;
    }
    return this.SUCCESS;

};
Scenario_and_Cases_data_bucket.prototype.searchBucketByScenarioCharacher = function (scenario)
{
    this.bucket = quickSortScenario(this.bucket, 0, this.bucket.length - 1);
    return BinarySearchBucketByCharacher(scenario, this.bucket);
};
Scenario_and_Cases_data_bucket.prototype.DeleteFromTempBucket = function (scenario, _case)
{
    console.log(this.name + " >> Deleting From Temp Bucket");
    var temp = [];
    var z = -1;
    //resizing the temp_bucket
    for (var y = 0; y < this.temp_bucket.length; y++)
    {
        ++z;
        if (this.temp_bucket[y].scenario === scenario
                && this.temp_bucket[y].case === _case)
        {
            z -= 1;
            delete this.temp_bucket[y];
            continue;
        } else
        {
            temp[z] = this.temp_bucket[y];
        }
    }
    this.temp_bucket = temp;

};
Scenario_and_Cases_data_bucket.prototype.setDataToBucket = function (scenario, _case)
{
    console.log(this.name + " >> set Data To Bucket");
    var temp = [];
    var z = -1;
    for (var i = 0; i < this.temp_bucket.length; i++)
    {
        ++z;
        if (this.temp_bucket[i].scenario === scenario
                && this.temp_bucket[i].case === _case)
        {

            --z;
            this.setCaseData(scenario, _case, this.temp_bucket[i].data);
            console.log(this.name + " >> Data set To bucket");
        } else
        {
            temp[z] = this.temp_bucket[i];
        }
    }
    this.temp_bucket = temp;
    return this.SUCCESS;
};
Scenario_and_Cases_data_bucket.prototype.setBucket = function (data)
{
    console.log(this.name + " >> Setting Bucket");
    this.bucket = quickSortScenario(data, 0, data.length - 1);
    console.log(this.bucket.length);

};
Scenario_and_Cases_data_bucket.prototype.getCases = function (scenario)
{
    console.log(this.name + " >> get Case");
    var index = searchScenario(scenario, this.bucket);
    if (index === -1)
        return this.ERROR;
    return this.bucket[index].cases;
};

Scenario_and_Cases_data_bucket.prototype.setCaseData = function (_scenario, _case, data)
{
    var scenario = {};
    console.log(this.name + " >> Setting Case Data");
    var index = searchScenario(_scenario, this.bucket);
    if (index === this.ERROR)
    {
        scenario.scenario = _scenario;
        scenario.notes = data.scenarioNotes;
        scenario.cases = [];
        var __case = {};
        __case.case = _case;
        __case.notes = data.caseNotes;
        __case.data = data;
        scenario.cases.push(__case);
        this.bucket.push(scenario);
        console.log(this.bucket);
        return this.SUCCESS;
    }
    var cases = this.bucket[index].cases;
    this.bucket[index].cases = quickSortCases(cases, 0, cases.length - 1);
    var case_index = searchCase(this.bucket[index].cases, _case);
    if (case_index === this.ERROR)
    {
        var __case = {};
        __case.case = _case;
        __case.notes = data.caseNotes;
        __case.data = data;
        this.bucket[index].cases.push(__case);
        return this.SUCCESS;
    }
    this.bucket[index].cases[case_index].data = data;
    return this.SUCCESS;
};
Scenario_and_Cases_data_bucket.prototype.getCaseData = function (scenario, _case)
{
    console.log(this.name + " >> Getting Case Data");
    this.bucket = quickSortScenario(this.bucket, 0, this.bucket.length - 1);
    var index = searchScenario(scenario, this.bucket);

    if (index === this.ERROR)
    {
        console.log(this.name + " >> No Scenario Found");
        return this.ERROR;
    }
    console.log(this.bucket[index]);
    var cases = this.bucket[index].cases;
    this.bucket[index].cases = quickSortCases(cases, 0, cases.length - 1);
    var case_index = searchCase(this.bucket[index].cases, _case);
    if (case_index === this.ERROR)
    {
        console.log(this.name + " >> No Case Found");
        return this.ERROR;
    }
    //console.log("Case data\n\n\n");
    //console.log(this.bucket[index].cases[case_index]);
    return this.bucket[index].cases[case_index];
};
Scenario_and_Cases_data_bucket.prototype.getScenarioNotes = function (scenario)
{
    console.log(this.name + " >> get Scenario Notes");
    var index = searchScenario(scenario, this.bucket);
    if (index === -1)
        return "Scenario has no notes";
    return this.bucket[index].notes;
};

Scenario_and_Cases_data_bucket.prototype.getCaseNotes = function (scenario, _case)
{
    console.log(this.name + " >> get Case Notes");
    var cases = this.getCases(scenario);
    var case_index = searchCase(cases, _case);
    if (case_index === -1)
        return " Case has no notes";
    return cases[case_index].notes;
};
Scenario_and_Cases_data_bucket.prototype.QuickSortCases = function (_bucket)
{
    console.log(this.name + " >> QuickSortCases");

    function caseSwap(items, firstIndex, secondIndex) {
        var temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;

    }
    function partitionCases(items, left, right) {


        var pivot = items[Math.floor((right + left) / 2)].case,
                i = left,
                j = right;



        var encoder = new TextEncoder();

        while (i <= j) {

            var temp_low_array = encoder.encode(items[i].case.toString());
            var temp_low = 0;
            for (var z = 0; z < temp_low_array.length; z++)
            {
                temp_low += temp_low_array[z];
            }
            var temp_pivot_array = encoder.encode(pivot);
            var temp_pivot = 0;
            for (var z = 0; z < temp_pivot_array.length; z++)
            {
                temp_pivot += temp_pivot_array[z];
            }
            while (temp_low < temp_pivot) {

                i++;
                temp_low_array = encoder.encode(items[i].case.toString());
                temp_low = 0;
                for (var z = 0; z < temp_low_array.length; z++)
                {
                    temp_low += temp_low_array[z];
                }

            }
            var temp_high_array = encoder.encode(items[j].case.toString());
            var temp_high = 0;
            for (var z = 0; z < temp_high_array.length; z++)
            {
                temp_high += temp_high_array[z];
            }
            while (temp_high > temp_pivot) {

                j--;

                temp_high_array = encoder.encode(items[j].case.toString());
                temp_high = 0;
                for (var z = 0; z < temp_high_array.length; z++)
                {
                    temp_high += temp_high_array[z];
                }

            }

            if (i <= j) {
                caseSwap(items, i, j);
                i++;
                j--;
            }
        }

        return i;
    }
    function quickSort(items, left, right) {

        var index;

        if (items.length > 1) {

            index = partitionCases(items, left, right);

            if (left < index - 1) {
                quickSort(items, left, index - 1);
            }

            if (index < right) {
                quickSort(items, index, right);
            }

        }
        return items;
    }
    quickSort(_bucket.cases, 0, _bucket.cases.length - 1);

};
/*************************************************
 * 
 * Helper functions
 */
function BinarySearchBucketByCharacher(scenario, bucket) {
    'use strict';
    var list_of_scenarios = [];
    var minIndex = 0;
    var maxIndex = bucket.length - 1;
    console.log(bucket);
    var currentIndex;
    var currentElement;
    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = "";
        for (var i = 0; i < scenario.length; i++)
        {
            currentElement += bucket[currentIndex].scenario[i];
        }
        if (currentElement < scenario) {
            minIndex = currentIndex + 1;
        } else if (currentElement > scenario) {
            maxIndex = currentIndex - 1;
        } else {
            console.log("empty " + currentIndex);
            break;
        }
    }
    var tempCurrentLowIndex = currentIndex;
    while (tempCurrentLowIndex > 0)
    {

        var temp = "";
        for (var i = 0; i < scenario.length; i++)
        {
            temp += bucket[tempCurrentLowIndex].scenario[i];
        }
        if (scenario === temp)
        {
            --tempCurrentLowIndex;
            console.log(tempCurrentLowIndex);
        } else
        {
            ++tempCurrentLowIndex;
            break;
        }

    }
    var tempCurrentHighIndex = currentIndex;
    while (tempCurrentHighIndex < bucket.length)
    {

        var temp = "";
        for (var i = 0; i < scenario.length; i++)
        {
            temp += bucket[tempCurrentHighIndex].scenario[i];
        }
        if (scenario === temp)
        {
            ++tempCurrentHighIndex;

        } else
        {
            break;
        }

    }
    console.log(tempCurrentLowIndex + ":" + tempCurrentHighIndex);
    for (var y = tempCurrentLowIndex; y < tempCurrentHighIndex; y++)
    {
        var temp = "";
        for (var i = 0; i < scenario.length; i++)
        {
            temp += bucket[y].scenario[i];
        }
        console.log(scenario + " scenario " + temp);



        if (scenario.length <= bucket[y].scenario.length)
        {
            list_of_scenarios.push(bucket[y]);
        }
        if (scenario.length > bucket[y].scenario.length)
        {
            list_of_scenarios.push(bucket[y]);
        }

    }
    return list_of_scenarios;
}
function caseSwap(items, firstIndex, secondIndex) {
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
    console.log(" caseSwamp ");
    for (var t = 0; t < items.length; t++)
    {
        console.log(t + ":" + items[t].case);
    }
}
function swap(items, firstIndex, secondIndex) {
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}
/*********************************
 * get case function 
 * @param {type} cases
 * @param {type} _case
 * @returns {undefined}
 */
function partitionCases(items, left, right) {


    var pivot = items[Math.floor((right + left) / 2)].case,
            i = left,
            j = right;

    var encoder = new TextEncoder();

    while (i <= j) {

        var temp_low_array = encoder.encode(items[i].case.toString());
        var temp_low = 0;
        for (var z = 0; z < temp_low_array.length; z++)
        {
            temp_low += temp_low_array[z];
        }
        var temp_pivot_array = encoder.encode(pivot);
        var temp_pivot = 0;
        for (var z = 0; z < temp_pivot_array.length; z++)
        {
            temp_pivot += temp_pivot_array[z];
        }
        while (temp_low < temp_pivot) {

            i++;
            if(i > right)
                break;
            temp_low_array = encoder.encode(items[i].case.toString());
            temp_low = 0;
            for (var z = 0; z < temp_low_array.length; z++)
            {
                temp_low += temp_low_array[z];
            }

        }
        var temp_high_array = encoder.encode(items[j].case.toString());
        var temp_high = 0;
        for (var z = 0; z < temp_high_array.length; z++)
        {
            temp_high += temp_high_array[z];
        }
        while (temp_high > temp_pivot) {

            j--;
            if(j < left)
                break;
            temp_high_array = encoder.encode(items[j].case.toString());
            temp_high = 0;
            for (var z = 0; z < temp_high_array.length; z++)
            {
                temp_high += temp_high_array[z];
            }

        }

        if (i <= j) {
            caseSwap(items, i, j);
            i++;
            j--;
        }
    }
    return i;
}
function quickSortCases(items, left, right) {

    var index;

    if (items.length > 1) {

        index = partitionCases(items, left, right);

        if (left < index - 1) {
            quickSortCases(items, left, index - 1);
        }

        if (index < right) {
            quickSortCases(items, index, right);
        }

    }
    return items;
}

function searchCase(cases, _case) {
    'use strict';
    var encoder = new TextEncoder();
    var minIndex = 0;
    var maxIndex = cases.length - 1;
    var currentIndex;
    var currentElement;
    var temp_current_element_array;
    var temp_current_element = 0;
    var temp_case_element_array = encoder.encode(_case.toString());
    var temp_case_element = 0;
    for (var a = 0; a < temp_case_element_array.length; a++)
    {
        temp_case_element += temp_case_element_array[a];
    }

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        temp_current_element_array = encoder.encode(cases[currentIndex].case);
        temp_current_element = 0;
        for (var z = 0; z < temp_current_element_array.length; z++)
        {
            temp_current_element += temp_current_element_array[z];
        }


        if (temp_current_element < temp_case_element) {
            minIndex = currentIndex + 1;
        } else if (temp_current_element > temp_case_element) {
            maxIndex = currentIndex - 1;
        } else {
            return currentIndex;
        }
    }

    return -1;
}
/*********************************************
 * scenario help functions
 * @param {type} items
 * @param {type} left
 * @param {type} right
 * @returns {partitionScenario.i}
 */
function partitionScenario(items, left, right) {


    var pivot = items[Math.floor((right + left) / 2)].scenario,
            i = left,
            j = right;

    var encoder = new TextEncoder();


    while (i <= j) {

        var temp_low_array = encoder.encode(items[i].scenario.toString());
        var temp_low = 0;
        for (var z = 0; z < temp_low_array.length; z++)
        {
            temp_low += temp_low_array[z];
        }
        var temp_pivot_array = encoder.encode(pivot);
        var temp_pivot = 0;
        for (var z = 0; z < temp_pivot_array.length; z++)
        {
            temp_pivot += temp_pivot_array[z];
        }
        while (temp_low < temp_pivot) {

            i++;
            if(i > right)
                break;
            temp_low_array = encoder.encode(items[i].scenario.toString());
            temp_low = 0;
            for (var z = 0; z < temp_low_array.length; z++)
            {
                temp_low += temp_low_array[z];
            }

        }
        var temp_high_array = encoder.encode(items[j].scenario.toString());
        var temp_high = 0;
        for (var z = 0; z < temp_high_array.length; z++)
        {
            temp_high += temp_high_array[z];
        }
        while (temp_high > temp_pivot) {

            j--;
            if(j < left)
                break;
            temp_high_array = encoder.encode(items[j].scenario.toString());
            temp_high = 0;
            for (var z = 0; z < temp_high_array.length; z++)
            {
                temp_high += temp_high_array[z];
            }
        }


        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}
function quickSortScenario(items, left, right) {

    var index;

    if (items.length > 1) {

        index = partitionScenario(items, left, right);

        if (left < index - 1) {
            quickSortScenario(items, left, index - 1);
        }

        if (index < right) {
            quickSortScenario(items, index, right);
        }

    }

    return items;
}

function searchScenario(scenario, bucket) {
    'use strict';
    console.log(">> search Scenario");
    var encoder = new TextEncoder();
    var minIndex = 0;
    var maxIndex = bucket.length - 1;
    var currentIndex;
    var currentElement;
    var temp_current_element_array;
    var temp_current_element = 0;
    console.log(scenario,bucket);
    var temp_scenario_element_array = encoder.encode(scenario.toString());
    var temp_scenario_element = 0;
    for (var a = 0; a < temp_scenario_element_array.length; a++)
    {
        temp_scenario_element += temp_scenario_element_array[a];
    }
    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        temp_current_element_array = encoder.encode(bucket[currentIndex].scenario);
        temp_current_element = 0;
        for (var z = 0; z < temp_current_element_array.length; z++)
        {
            temp_current_element += temp_current_element_array[z];
        }


        if (temp_current_element < temp_scenario_element) {
            minIndex = currentIndex + 1;
        } else if (temp_current_element > temp_scenario_element) {
            maxIndex = currentIndex - 1;
        } else {
            return currentIndex;
        }
    }

    return -1;
}

