function neededShapes(shape, wall1, wall2) {
    needed = [];
    extra = [];

    if(shape === 'Triangle') {
        if(wall1 != 'Square' && wall2 != 'Square') needed.push('Square');
        if(wall1 != 'Circle' && wall2 != 'Circle') needed.push('Circle');
        if(wall1 === 'Triangle') extra.push('Triangle');
        if(wall2 === 'Triangle') extra.push('Triangle');
        if(wall1 === 'Circle' && wall2 === 'Circle') extra.push('Circle');
        if(wall1 === 'Square' && wall2 === 'Square') extra.push('Square');
    }
    else if(shape === 'Square') {
        if(wall1 != 'Triangle' && wall2 != 'Triangle') needed.push('Triangle');
        if(wall1 != 'Circle' && wall2 != 'Circle') needed.push('Circle');
        if(wall1 === 'Square') extra.push('Square');
        if(wall2 === 'Square') extra.push('Square');
        if(wall1 === 'Circle' && wall2 === 'Circle') extra.push('Circle');
        if(wall1 === 'Triangle' && wall2 === 'Triangle') extra.push('Triangle');
    }
    else { 
        if(wall1 != 'Triangle' && wall2 != 'Triangle') needed.push('Triangle');
        if(wall1 != 'Square' && wall2 != 'Square') needed.push('Square');
        if(wall1 === 'Circle') extra.push('Circle');
        if(wall2 === 'Circle') extra.push('Circle');
        if(wall1 === 'Triangle' && wall2 === 'Triangle') extra.push('Triangle');
        if(wall1 === 'Square' && wall2 === 'Square') extra.push('Square');
    }

    return [needed, extra];
};

// Function used below
function determineInsideShapes(obj) {
    let shapes = {};
    shapes.left = [];
    shapes.middle = [];
    shapes.right = [];

    shapes.left = neededShapes(obj.insideGuardianLeft, obj.insideLeftWall1, obj.insideLeftWall2)[0];
    shapes.middle = neededShapes(obj.insideGuardianMiddle, obj.insideMiddleWall1, obj.insideMiddleWall2)[0];
    shapes.right = neededShapes(obj.insideGuardianRight, obj.insideRightWall1, obj.insideRightWall2)[0];
    obj.insideNeededShapes = shapes;

    let shapes2 = {};
    shapes2.left = [];
    shapes2.middle = [];
    shapes2.right = [];

    shapes2.left = neededShapes(obj.insideGuardianLeft, obj.insideLeftWall1, obj.insideLeftWall2)[1];
    shapes2.middle = neededShapes(obj.insideGuardianMiddle, obj.insideMiddleWall1, obj.insideMiddleWall2)[1];
    shapes2.right = neededShapes(obj.insideGuardianRight, obj.insideRightWall1, obj.insideRightWall2)[1];
    obj.insideExtraShapes = shapes2;
};

function printArray(msg, array)
{
    array.forEach((element) => msg += ' ' + element);
    return msg;

};

function test(obj) {
 
    // Only display steps if all shapes have been selected
    if(!obj.insideLeftWall1 || !obj.insideLeftWall2  ||
       !obj.insideMiddleWall1 || !obj.insideMiddleWall2 ||
       !obj.insideRightWall1 || !obj.insideRightWall2)
        return "None";
    
    determineInsideShapes(obj);

    steps = [];

    //steps.push(printArray("Left needs: ", obj.insideNeededShapes.left));
    //steps.push(printArray("Left must give away: ", obj.insideExtraShapes.left));
    //steps.push(printArray("Middle needs: ", obj.insideNeededShapes.middle));
    //steps.push(printArray("Middle must give away: ", obj.insideExtraShapes.middle));
    //steps.push(printArray("Right needs: ", obj.insideNeededShapes.right));
    //steps.push(printArray("Right must give away: ", obj.insideExtraShapes.right));

    steps.push("<hr>");

    let counter = 0;
    while (obj.insideNeededShapes.left.length > 0 || obj.insideExtraShapes.left.length > 0 ||
           obj.insideNeededShapes.middle.length > 0 || obj.insideExtraShapes.middle.length > 0 ||
           obj.insideNeededShapes.right.length > 0  || obj.insideExtraShapes.right.length > 0)
    {
        counter++;
        
        let midShapeThatLeftNeeds = findFirstCommonString(obj.insideNeededShapes.left, obj.insideExtraShapes.middle);
        let leftShapeThatMidNeeds = findFirstCommonString(obj.insideNeededShapes.middle, obj.insideExtraShapes.left);
        if(midShapeThatLeftNeeds != null && leftShapeThatMidNeeds != null)
        {
            steps.push('Middle send <b><font color="orange">' + midShapeThatLeftNeeds + '</font></b> to left');
            steps.push('Left send <b><font color="orange">' + leftShapeThatMidNeeds + '</font></b> to middle');
            obj.insideNeededShapes.left = removeFirstOccurrence(obj.insideNeededShapes.left, midShapeThatLeftNeeds);
            obj.insideNeededShapes.middle = removeFirstOccurrence(obj.insideNeededShapes.middle, leftShapeThatMidNeeds);
            obj.insideExtraShapes.left = removeFirstOccurrence(obj.insideExtraShapes.left, leftShapeThatMidNeeds);
            obj.insideExtraShapes.middle = removeFirstOccurrence(obj.insideExtraShapes.middle, midShapeThatLeftNeeds);
            steps.push("----");
            continue;
        }

        let rightShapeThatMidNeeds = findFirstCommonString(obj.insideNeededShapes.middle, obj.insideExtraShapes.right);
        let midShapeThatRightNeeds = findFirstCommonString(obj.insideNeededShapes.right, obj.insideExtraShapes.middle);
        if(rightShapeThatMidNeeds != null && midShapeThatRightNeeds != null)
        {
            steps.push('Right sends <b><font color="orange">' + rightShapeThatMidNeeds + '</font></b> to middle');
            steps.push('Mid sends <b><font color="orange">' + midShapeThatRightNeeds + '</font></b> to right');
            obj.insideNeededShapes.middle = removeFirstOccurrence(obj.insideNeededShapes.middle, rightShapeThatMidNeeds);
            obj.insideNeededShapes.right = removeFirstOccurrence(obj.insideNeededShapes.right, midShapeThatRightNeeds);
            obj.insideExtraShapes.middle = removeFirstOccurrence(obj.insideExtraShapes.middle, midShapeThatRightNeeds);
            obj.insideExtraShapes.right = removeFirstOccurrence(obj.insideExtraShapes.right, rightShapeThatMidNeeds);
            steps.push("----");
            continue;
        }

        let rightShapeThatLeftNeeds = findFirstCommonString(obj.insideNeededShapes.left, obj.insideExtraShapes.right);
        let leftShapeThatRightNeeds = findFirstCommonString(obj.insideNeededShapes.right, obj.insideExtraShapes.left);
        if(rightShapeThatLeftNeeds != null && leftShapeThatRightNeeds != null)
        {
            steps.push('Right sends <b><font color="orange">' + rightShapeThatLeftNeeds + '</font></b> to left');
            steps.push('Left sends <b><font color="orange">' + leftShapeThatRightNeeds + '</font></b> to right');
            obj.insideNeededShapes.left = removeFirstOccurrence(obj.insideNeededShapes.left, rightShapeThatLeftNeeds);
            obj.insideNeededShapes.right = removeFirstOccurrence(obj.insideNeededShapes.right, leftShapeThatRightNeeds);
            obj.insideExtraShapes.left = removeFirstOccurrence(obj.insideExtraShapes.left, leftShapeThatRightNeeds);
            obj.insideExtraShapes.right = removeFirstOccurrence(obj.insideExtraShapes.right, rightShapeThatLeftNeeds);
            steps.push("----");
            continue;
        }

        // If we get here, there are no "perfect" matches.  A triple swap will have to happen

        if(leftShapeThatMidNeeds != null && midShapeThatRightNeeds != null && rightShapeThatLeftNeeds != null)
        {
            steps.push('Triple swap:');
            steps.push('Left sends <b><font color="orange">' + leftShapeThatMidNeeds + '</font></b> to middle');
            steps.push('Middle sends <b><font color="orange">' + midShapeThatRightNeeds + '</font></b> to right');
            steps.push('Right sends <b><font color="orange">' + rightShapeThatLeftNeeds + '</font></b> to left');


            obj.insideNeededShapes.left = removeFirstOccurrence(obj.insideNeededShapes.left, rightShapeThatLeftNeeds);
            obj.insideNeededShapes.middle = removeFirstOccurrence(obj.insideNeededShapes.middle, leftShapeThatMidNeeds);
            obj.insideNeededShapes.right = removeFirstOccurrence(obj.insideNeededShapes.right, midShapeThatRightNeeds);

            obj.insideExtraShapes.left = removeFirstOccurrence(obj.insideExtraShapes.left, leftShapeThatMidNeeds);
            obj.insideExtraShapes.middle = removeFirstOccurrence(obj.insideExtraShapes.middle, midShapeThatRightNeeds);
            obj.insideExtraShapes.right = removeFirstOccurrence(obj.insideExtraShapes.right, rightShapeThatLeftNeeds);

            continue;
        }

        if(leftShapeThatRightNeeds != null && midShapeThatLeftNeeds != null && rightShapeThatMidNeeds != null)
            {
                steps.push('Triple swap:');
                steps.push('Left sends <b><font color="orange">' + leftShapeThatRightNeeds + '</font></b> to right');
                steps.push('Middle sends <b><font color="orange">' + midShapeThatLeftNeeds + '</font></b> to left');
                steps.push('Right sends <b><font color="orange">' + rightShapeThatMidNeeds + '</font></b> to middle');

                obj.insideNeededShapes.left = removeFirstOccurrence(obj.insideNeededShapes.left, midShapeThatLeftNeeds);
                obj.insideNeededShapes.middle = removeFirstOccurrence(obj.insideNeededShapes.middle, rightShapeThatMidNeeds);
                obj.insideNeededShapes.right = removeFirstOccurrence(obj.insideNeededShapes.right, leftShapeThatRightNeeds);
    
                obj.insideExtraShapes.left = removeFirstOccurrence(obj.insideExtraShapes.left, leftShapeThatRightNeeds);
                obj.insideExtraShapes.middle = removeFirstOccurrence(obj.insideExtraShapes.middle, midShapeThatLeftNeeds);
                obj.insideExtraShapes.right = removeFirstOccurrence(obj.insideExtraShapes.right, rightShapeThatMidNeeds);
    
                continue;
            }

        if(counter > 10)
        {
            steps.push('<font color="red">resonance cascade. aborted.</font>');
            break;
        }
    }


    if(counter > 10)
        steps.push('<font color="red">error, may the traveler have mercy on your soul</font>');
    else
        steps.push("Done!");
    
    return steps.join('<br>');
};

function findFirstCommonString(arr1, arr2) {
    // Create a Set from the first array for fast lookup
    const set1 = new Set(arr1);
    
    // Iterate through the second array to find the first common string
    for (let str of arr2) {
        if (set1.has(str)) {
            return str; // Return the first common string found
        }
    }
    
    // If no common string is found, return null
    return null;
};

function removeFirstOccurrence(arr, strToRemove) {
    const index = arr.indexOf(strToRemove);
    if (index !== -1) {
        arr.splice(index, 1);
    }
    return arr;
}

