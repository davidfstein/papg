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

const highlightDiv = (id) => {
    console.log(id)
    r=236;
    g=238;
    b=239;
    a=.4;
    document.getElementById(id).parentElement.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ',' + a + ')';
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
    highlightDiv(next.id);
}

// object.addEventListener("submit", myScript);

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