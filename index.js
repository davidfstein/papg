const resize_ob = new ResizeObserver(function(entries) {
    document.getElementById('background').style.height = document.body.offsetHeight + 'px';
    document.getElementById('footer-cover').style.height = document.body.offsetHeight + 'px';
});

// start observing for resize
resize_ob.observe(document.body);

const scrollToID = (id) => {
    document.getElementById(id).scrollIntoView(
        {behavior: 'smooth'}
    );
}

const focusDiv = (el) => {
    r=236;
    g=238;
    b=239;
    a=.4;
    el.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ',' + a + ')';
}

const unfocusDiv = (el) => {
    el.style.backgroundColor = 'rgba(255,255,255,0)';
}

const goToNextQuestion = () => {
    const questions = Array.from(document.querySelectorAll("[id^='question']"));
    let nextClosest = Infinity;
    let next;
    questions.forEach(q => {
        q.parentElement.style.backgroundColor = null;
        const viewportOffset = q.getBoundingClientRect();
        // these are relative to the viewport
        const offset = viewportOffset.top;
        if (offset > 0 && offset < nextClosest) {
            nextClosest = offset;
            next = q;
        }
    });
    scrollToID(next.id);
    // highlightDiv(next.parentElement);
}

const indexOfMax = (arr) => {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

const vcfinput = document.getElementById('vcfUpload')
vcfinput.onchange = (event) => {
    const fileList = vcfinput.files;
    console.log(fileList) 
 }

 Array.from(document.querySelectorAll('.question-wrapper')).forEach(q => {
     q.onmouseenter = (q) => {focusDiv(q.srcElement)};
     q.onmouseleave = (q) => {unfocusDiv(q.srcElement)};
 })