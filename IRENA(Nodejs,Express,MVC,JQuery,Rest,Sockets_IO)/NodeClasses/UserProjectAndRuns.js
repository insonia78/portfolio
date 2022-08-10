
var UserProjectAndRuns = function()
{
    this.bucket;
};
UserProjectAndRuns.prototype.SetBucket = function(data)
{
      
     this.bucket = data;  
};
UserProjectAndRuns.prototype.getRuns = function(project)
{
    
}

function partitionProject(items, left, right) {

    
    var pivot   = items[Math.floor((right + left) / 2)].project,
        i       = left,
        j       = right;


    while (i <= j) {

        while (items[i].username < pivot) {
            i++;
        }

        while (items[j].username > pivot) {
            j--;
        }

        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}

function quickSortProject(items, left, right) {

    var index;

    if (items.length > 1) {

        index = partitionUserName(items, left, right);

        if (left < index - 1) {
            quickSortUserName(items, left, index - 1);
        }

        if (index < right) {
            quickSortUserName(items, index, right);
        }

    }

    return items;
}

