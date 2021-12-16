var SNP_LIST = null;

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

const parseGenotype = (genotype) => {
    return genotype.split('/').reduce((a, b) => parseInt(a) + parseInt(b), 0);
}

const parseSNPs = (snps) => {
    SNP_LIST = snps.map(snp => {
        return {
            'id': snp[0],
            'genotype': parseGenotype(snp[3])
        }
    });
    console.log(SNP_LIST)
}

const vcfinput = document.getElementById('vcfUpload')
vcfinput.onchange = async (event) => {
    const infoel = document.getElementById('result-info');
    infoel.innerText = "Preparing your results..."
    const fileList = vcfinput.files;
    const results = await fetch('http://127.0.0.1:5000/api/parsevcf',
        {
                method:'POST',
                body: fileList[0]
        }
    )
    const snps = await results.json()
    infoel.innerText = "Your results are ready! Proceed to the quiz"
    parseSNPs(snps);

 }

 Array.from(document.querySelectorAll('.question-wrapper')).forEach(q => {
     q.onmouseenter = (q) => {focusDiv(q.srcElement)};
     q.onmouseleave = (q) => {unfocusDiv(q.srcElement)};
 })

 document.getElementById('athletic-submit').onclick = (event) => {
    const formEl = document.forms['athletic-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q11', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);

 }

 document.getElementById('social-submit').onclick = (event) => {
    const formEl = document.forms['social-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q21', 'Q22', 'Q23', 'Q24', 'Q25', 'Q26', 'Q27']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);
 }

 document.getElementById('time-submit').onclick = (event) => {
    const formEl = document.forms['time-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q31', 'Q32', 'Q33', 'Q34', 'Q35']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);
 }

 document.getElementById('problem-submit').onclick = (event) => {
    const formEl = document.forms['problem-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q41', 'Q42', 'Q43', 'Q44', 'Q45', 'Q46', 'Q47']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);
 }

 document.getElementById('stress-submit').onclick = (event) => {
    const formEl = document.forms['stress-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q51', 'Q52', 'Q53', 'Q54', 'Q55', 'Q56']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);
    console.log(score)
 }