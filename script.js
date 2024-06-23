function neededShapes(shape, wall1, wall2) {
    needed = [];
    extra = [];

    // What is needed to form the key?
    if(shape === 'Triangle') {
        if(wall1 != 'Square' && wall2 != 'Square') needed.push('Square');
        if(wall1 != 'Circle' && wall2 != 'Circle') needed.push('Circle');
    }
    else if(shape === 'Square') {
        if(wall1 != 'Triangle' && wall2 != 'Triangle') needed.push('Triangle');
        if(wall1 != 'Circle' && wall2 != 'Circle') needed.push('Circle');
    }
    else { 
        if(wall1 != 'Triangle' && wall2 != 'Triangle') needed.push('Triangle');
        if(wall1 != 'Square' && wall2 != 'Square') needed.push('Square');
    }

    // Always need to give away what you start with
    extra.push(wall1);
    extra.push(wall2);

    return [needed, extra];
};

function determineShapesForPhase1(obj) {
    let needed = {left: [], middle:[], right:[]};
    let extra = {left: [], middle:[], right:[]};

    if(obj.insideLeftWall1 != obj.insideGuardianLeft) {
        needed.left.push(obj.insideGuardianLeft);
        extra.left.push(obj.insideLeftWall1);   
    }
    if(obj.insideLeftWall2 != obj.insideGuardianLeft) {
        needed.left.push(obj.insideGuardianLeft);
        extra.left.push(obj.insideLeftWall2);   
    }
    if(obj.insideMiddleWall1 != obj.insideGuardianMiddle) {
        needed.middle.push(obj.insideGuardianMiddle);
        extra.middle.push(obj.insideMiddleWall1);   
    }
    if(obj.insideMiddleWall2 != obj.insideGuardianMiddle) {
        needed.middle.push(obj.insideGuardianMiddle);
        extra.middle.push(obj.insideMiddleWall2);   
    }
    if(obj.insideRightWall1 != obj.insideGuardianRight) {
        needed.right.push(obj.insideGuardianRight);
        extra.right.push(obj.insideRightWall1);   
    }
    if(obj.insideRightWall2 != obj.insideGuardianRight) {
        needed.right.push(obj.insideGuardianRight);
        extra.right.push(obj.insideRightWall2);   
    }

    obj.insideNeededShapes = needed;
    obj.insideExtraShapes = extra;
};


function printArray(msg, array)
{
    array.forEach((element) => msg += ' ' + element);
    return msg;

};

function removeStringFromArray(stringToRemove, array) {
    const index = array.indexOf(stringToRemove);
    if (index !== -1) {
        array.splice(index, 1);
    }
    return array;
}

function test(obj) {
 
    // Only display steps if all shapes have been selected
    if(!obj.insideLeftWall1 || !obj.insideLeftWall2  ||
       !obj.insideMiddleWall1 || !obj.insideMiddleWall2 ||
       !obj.insideRightWall1 || !obj.insideRightWall2)
        return "None";
    
    steps = [];

    const map = new Map();
    map.set('Circle', 0);
    map.set('Triangle', 0);
    map.set('Square', 0);

    map.set(obj.insideLeftWall1, map.get(obj.insideLeftWall1) + 1);
    map.set(obj.insideLeftWall2, map.get(obj.insideLeftWall2) + 1);
    map.set(obj.insideMiddleWall1, map.get(obj.insideMiddleWall1) + 1);
    map.set(obj.insideMiddleWall2, map.get(obj.insideMiddleWall2) + 1);
    map.set(obj.insideRightWall1, map.get(obj.insideRightWall1) + 1);
    map.set(obj.insideRightWall2, map.get(obj.insideRightWall2) + 1);

    if(map.get('Circle') != 2) {
        steps.push("<span class='text-error'>Invalid number of circles selected</span>");
        return steps.join('<br>');
    }
    if(map.get('Triangle') != 2) {
        steps.push("<span class='text-error'>Invalid number of triangles selected</span>");
        return steps.join('<br>');
    }
    if(map.get('Square') != 2) {
        steps.push("<span class='text-error'>Invalid number of squares selected</span>");
        return steps.join('<br>');
    }

    //
    // Phase 1: Give all guardians their own shape
    //
    determineShapesForPhase1(obj);


    while(obj.insideExtraShapes.left.length > 0) {
        let shapeToPush = obj.insideExtraShapes.left[0];
        if(obj.insideNeededShapes.middle.includes(shapeToPush)) {
            steps.push("Left gives <span class='text-shape'>" + shapeToPush + "</span> to middle");
            obj.insideNeededShapes.middle = removeStringFromArray(shapeToPush, obj.insideNeededShapes.middle);
            obj.insideExtraShapes.left = removeStringFromArray(shapeToPush, obj.insideExtraShapes.left);
            continue;
        }
        if(obj.insideNeededShapes.right.includes(shapeToPush)) {
            steps.push("Left gives <span class='text-shape'>" + shapeToPush + "</span> to right");
            obj.insideNeededShapes.right = removeStringFromArray(shapeToPush, obj.insideNeededShapes.right);
            obj.insideExtraShapes.left = removeStringFromArray(shapeToPush, obj.insideExtraShapes.left);
            continue;
        }
        steps.join('You should not see this message unless you messed with the JavaScript...');
        break; // Shouldn't get here, break to prevent infinite loop
    }

    while(obj.insideExtraShapes.middle.length > 0) {
        let shapeToPush = obj.insideExtraShapes.middle[0];
        if(obj.insideNeededShapes.left.includes(shapeToPush)) {
            steps.push("Middle gives <span class='text-shape'>" + shapeToPush + "</span> to left");
            obj.insideNeededShapes.left = removeStringFromArray(shapeToPush, obj.insideNeededShapes.left);
            obj.insideExtraShapes.middle = removeStringFromArray(shapeToPush, obj.insideExtraShapes.middle);
            continue;
        }
        if(obj.insideNeededShapes.right.includes(shapeToPush)) {
            steps.push("Middle gives <span class='text-shape'>" + shapeToPush + "</span> to right");
            obj.insideNeededShapes.right = removeStringFromArray(shapeToPush, obj.insideNeededShapes.right);
            obj.insideExtraShapes.middle = removeStringFromArray(shapeToPush, obj.insideExtraShapes.middle);
            continue;
        }
        steps.join('You should not see this message unless you messed with the JavaScript...');
        break; // Shouldn't get here, break to prevent infinite loop
    }

    while(obj.insideExtraShapes.right.length > 0) {
        let shapeToPush = obj.insideExtraShapes.right[0];
        if(obj.insideNeededShapes.left.includes(shapeToPush)) {
            steps.push("Right gives <span class='text-shape'>" + shapeToPush + "</span> to left");
            obj.insideNeededShapes.left = removeStringFromArray(shapeToPush, obj.insideNeededShapes.left);
            obj.insideExtraShapes.right = removeStringFromArray(shapeToPush, obj.insideExtraShapes.right);
            continue;
        }
        if(obj.insideNeededShapes.middle.includes(shapeToPush)) {
            steps.push("Right gives <span class='text-shape'>" + shapeToPush + "</span> to middle");
            obj.insideNeededShapes.middle = removeStringFromArray(shapeToPush, obj.insideNeededShapes.middle);
            obj.insideExtraShapes.right = removeStringFromArray(shapeToPush, obj.insideExtraShapes.right);
            continue;
        }
        steps.join('You should not see this message unless you messed with the JavaScript...');
        break; // Shouldn't get here, break to prevent infinite loop
    }

    if(steps.length > 0) steps.push("<span class='text-subsection'>Phase 1 complete</span>");
    else steps.push("<span class='text-subsection'>Phase 1 not necessary. RNGesus smiles upon you.</span>");
    
    steps.push("<span class='text-subsection'>Phase 2:</span>");

    steps.push("Left gives <span class='text-shape'>" + obj.insideGuardianLeft + "</span> to middle");
    steps.push("Left gives <span class='text-shape'>" + obj.insideGuardianLeft + "</span> to right");
    steps.push("Middle gives <span class='text-shape'>" + obj.insideGuardianMiddle + "</span> to left");
    steps.push("Middle gives <span class='text-shape'>" + obj.insideGuardianMiddle + "</span> to right");
    steps.push("Right gives <span class='text-shape'>" + obj.insideGuardianRight + "</span> to left");
    steps.push("Right gives <span class='text-shape'>" + obj.insideGuardianRight + "</span> to middle");
    return steps.join("<br>");
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

