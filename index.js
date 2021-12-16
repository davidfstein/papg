var SNP_LIST = {};
const SNP_TRAIT = {
    'athleticism': ['rs4341', 'rs12594956', 'rs2306604', 'rs324420', 'rs4950'],
    'attitude': ['rs5759037', 'rs2164273', 'rs1426371', 'rs7498702', 'rs6481128'],
    'morning': ['rs150812083', 'rs139315125'],
    'problem': ['rs5993883', 'rs362584', 'rs2576037'],
    'warrior': ['rs4680'],
    'conscientiousness': ['rs3814424'],
    'gambling': ['rs1402494'],
    'politics': ['rs10952668'],
    'hostility': ['rs802047','rs802028','rs802030','rs802026','rs802036','rs802025',
                  'rs802024','rs802032','rs802049','rs802051','rs12936442','rs894664',
                  'rs6502671','rs7216028','rs7510759','rs7510924','rs7290560','rs8136107',
                  'rs3783337','rs7158754','rs3783332','rs2181102','rs7159195','rs11160570',
                  'rs941898']
}
ncbi_url = "https://www.ncbi.nlm.nih.gov/snp/"


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

const parseSNPs = async (snps) => {
    const out = {}
    const genotypes = snps.map(snp => parseGenotype(snp[3]));
    for (let i = 0; i < genotypes.length; i++) {
        if (!out.hasOwnProperty(snps[i][0])) out[snps[i][0]] = genotypes[i];
    }
    SNP_LIST = out;
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
    let type = null;
    if (score >= 8) type = 'Very athletic'
    else if (score >= 4 && score <= 7) type = 'Moderately athletic'
    else type = 'Not athletic'
    document.getElementById('q1ResultClass').innerText = type;
    const snpString = SNP_TRAIT['athleticism'].map(snp => {
        return `<a href=${ncbi_url + snp}>${snp}</a>`
    }).join(', ')
    document.getElementById('q1Variants').innerHTML = snpString;
    const homoSNPs = [];
    SNP_TRAIT['athleticism'].forEach(snp => {
        console.log(snp, SNP_LIST[snp])
        if (SNP_LIST[snp] == 2) homoSNPs.push(snp) 
    })
    const heteroSNPs = [];
    SNP_TRAIT['athleticism'].forEach(snp => {
        if (SNP_LIST[snp] == 1) heteroSNPs.push(snp) 
    })
    if (homoSNPs.length !== 0) {
        const homoel = document.getElementById('q1Homo');
        homoel.style.visibility = 'visible';
        const homovarel = document.getElementById('q1HomoVar');
        const homoSNPString = homoSNPs.map(snp => {
            return `<a href=${ncbi_url + snp}>${snp}</a>`
        }).join(', ')
        homovarel.innerHTML = homoSNPString; 
    } 
    if (heteroSNPs.length !== 0) {
        const heteroel = document.getElementById('q1Hetero');
        heteroel.style.visibility = 'visible';
        const heterovarel = document.getElementById('q1HeteroVar');
        const heteroSNPString = heteroSNPs.map(snp => {
            return `<a href=${ncbi_url + snp}>${snp}</a>`
        }).join(', ')
        heterovarel.innerHTML = heteroSNPString; 
    } 
    if (homoSNPs.length === 0 && heteroSNPs.length === 0) {
        document.getElementById('q1NothingFound').style.visibility = 'visible';
    }
 }

 document.getElementById('social-submit').onclick = (event) => {
    const formEl = document.forms['social-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q21', 'Q22', 'Q23', 'Q24', 'Q25', 'Q26', 'Q27']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);
    if (score >= 8) type = 'Extroverted'
    else if (score >= 5 && score <= 7) type = 'Ambiverted'
    else type = 'Introverted'
    document.getElementById('q2ResultClass').innerText = type;
    const snpString = SNP_TRAIT['attitude'].map(snp => {
        return `<a href=${ncbi_url + snp}>${snp}</a>`
    }).join(', ')
    document.getElementById('q2Variants').innerHTML = snpString;
    const homoSNPs = [];
    SNP_TRAIT['attitude'].forEach(snp => {
        console.log(snp, SNP_LIST[snp])
        if (SNP_LIST[snp] == 2) homoSNPs.push(snp) 
    })
    const heteroSNPs = [];
    SNP_TRAIT['attitude'].forEach(snp => {
        if (SNP_LIST[snp] == 1) heteroSNPs.push(snp) 
    })
    console.log(homoSNPs, heteroSNPs)
    if (homoSNPs.length !== 0) {
        const homoel = document.getElementById('q2Homo');
        homoel.style.visibility = 'visible';
        const homovarel = document.getElementById('q2HomoVar');
        const homoSNPString = homoSNPs.map(snp => {
            return `<a href=${ncbi_url + snp}>${snp}</a>`
        }).join(', ')
        homovarel.innerHTML = homoSNPString; 
    } 
    if (heteroSNPs.length !== 0) {
        const heteroel = document.getElementById('q2Hetero');
        heteroel.style.visibility = 'visible';
        const heterovarel = document.getElementById('q2HeteroVar');
        const heteroSNPString = heteroSNPs.map(snp => {
            return `<a href=${ncbi_url + snp}>${snp}</a>`
        }).join(', ')
        heterovarel.innerHTML = heteroSNPString; 
    } 
    if (homoSNPs.length === 0 && heteroSNPs.length === 0) {
        document.getElementById('q2NothingFound').style.visibility = 'visible';
    }
 }

 document.getElementById('time-submit').onclick = (event) => {
    const formEl = document.forms['time-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q31', 'Q32', 'Q33', 'Q34', 'Q35']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);
    if (score >= 11) type = 'an Early bird'
    else if (score >= 9 && score <= 10) type = 'neither an early bird nor a night owl'
    else type = 'a Night owl'
    document.getElementById('q3ResultClass').innerText = type;
    const snpString = SNP_TRAIT['morning'].map(snp => {
        return `<a href=${ncbi_url + snp}>${snp}</a>`
    }).join(', ')
    document.getElementById('q3Variants').innerHTML = snpString;
    const homoSNPs = [];
    SNP_TRAIT['morning'].forEach(snp => {
        console.log(snp, SNP_LIST[snp])
        if (SNP_LIST[snp] == 2) homoSNPs.push(snp) 
    })
    const heteroSNPs = [];
    SNP_TRAIT['morning'].forEach(snp => {
        if (SNP_LIST[snp] == 1) heteroSNPs.push(snp) 
    })
    console.log(homoSNPs, heteroSNPs)
    if (homoSNPs.length !== 0) {
        const homoel = document.getElementById('q3Homo');
        homoel.style.visibility = 'visible';
        const homovarel = document.getElementById('q3HomoVar');
        const homoSNPString = homoSNPs.map(snp => {
            return `<a href=${ncbi_url + snp}>${snp}</a>`
        }).join(', ')
        homovarel.innerHTML = homoSNPString; 
    } 
    if (heteroSNPs.length !== 0) {
        const heteroel = document.getElementById('q3Hetero');
        heteroel.style.visibility = 'visible';
        const heterovarel = document.getElementById('q3HeteroVar');
        const heteroSNPString = heteroSNPs.map(snp => {
            return `<a href=${ncbi_url + snp}>${snp}</a>`
        }).join(', ')
        heterovarel.innerHTML = heteroSNPString; 
    } 
    if (homoSNPs.length === 0 && heteroSNPs.length === 0) {
        document.getElementById('q3NothingFound').style.visibility = 'visible';
    }
 }

 document.getElementById('problem-submit').onclick = (event) => {
    const formEl = document.forms['problem-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q41', 'Q42', 'Q43', 'Q44', 'Q45', 'Q46', 'Q47']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);
    if (score >= 11) type = 'a divergent thinker'
    else if (score >= 9 && score <= 10) type = 'a convergent and divergent thinker'
    else type = 'a convergent thinker'
    document.getElementById('q4ResultClass').innerText = type;
    const snpString = SNP_TRAIT['problem'].map(snp => {
        return `<a href=${ncbi_url + snp}>${snp}</a>`
    }).join(', ')
    document.getElementById('q4Variants').innerHTML = snpString;
    const homoSNPs = [];
    SNP_TRAIT['problem'].forEach(snp => {
        console.log(snp, SNP_LIST[snp])
        if (SNP_LIST[snp] == 2) homoSNPs.push(snp) 
    })
    const heteroSNPs = [];
    SNP_TRAIT['problem'].forEach(snp => {
        if (SNP_LIST[snp] == 1) heteroSNPs.push(snp) 
    })
    console.log(homoSNPs, heteroSNPs)
    if (homoSNPs.length !== 0) {
        const homoel = document.getElementById('q4Homo');
        homoel.style.visibility = 'visible';
        const homovarel = document.getElementById('q4HomoVar');
        const homoSNPString = homoSNPs.map(snp => {
            return `<a href=${ncbi_url + snp}>${snp}</a>`
        }).join(', ')
        homovarel.innerHTML = homoSNPString; 
    } 
    if (heteroSNPs.length !== 0) {
        const heteroel = document.getElementById('q4Hetero');
        heteroel.style.visibility = 'visible';
        const heterovarel = document.getElementById('q4HeteroVar');
        const heteroSNPString = heteroSNPs.map(snp => {
            return `<a href=${ncbi_url + snp}>${snp}</a>`
        }).join(', ')
        heterovarel.innerHTML = heteroSNPString; 
    } 
    if (homoSNPs.length === 0 && heteroSNPs.length === 0) {
        document.getElementById('q4NothingFound').style.visibility = 'visible';
    }
 }

 document.getElementById('stress-submit').onclick = (event) => {
    const formEl = document.forms['stress-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q51', 'Q52', 'Q53', 'Q54', 'Q55', 'Q56']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);
    if (score >= 11) type = 'a divergent thinker'
    else if (score >= 9 && score <= 10) type = 'a convergent and divergent thinker'
    else type = 'a convergent thinker'
    document.getElementById('q4ResultClass').innerText = type;
    const snpString = SNP_TRAIT['problem'].map(snp => {
        return `<a href=${ncbi_url + snp}>${snp}</a>`
    }).join(', ')
    document.getElementById('q4Variants').innerHTML = snpString;
    const homoSNPs = [];
    SNP_TRAIT['problem'].forEach(snp => {
        console.log(snp, SNP_LIST[snp])
        if (SNP_LIST[snp] == 2) homoSNPs.push(snp) 
    })
    const heteroSNPs = [];
    SNP_TRAIT['problem'].forEach(snp => {
        if (SNP_LIST[snp] == 1) heteroSNPs.push(snp) 
    })
    console.log(homoSNPs, heteroSNPs)
    if (homoSNPs.length !== 0) {
        const homoel = document.getElementById('q4Homo');
        homoel.style.visibility = 'visible';
        const homovarel = document.getElementById('q4HomoVar');
        const homoSNPString = homoSNPs.map(snp => {
            return `<a href=${ncbi_url + snp}>${snp}</a>`
        }).join(', ')
        homovarel.innerHTML = homoSNPString; 
    } 
    if (heteroSNPs.length !== 0) {
        const heteroel = document.getElementById('q4Hetero');
        heteroel.style.visibility = 'visible';
        const heterovarel = document.getElementById('q4HeteroVar');
        const heteroSNPString = heteroSNPs.map(snp => {
            return `<a href=${ncbi_url + snp}>${snp}</a>`
        }).join(', ')
        heterovarel.innerHTML = heteroSNPString; 
    } 
    if (homoSNPs.length === 0 && heteroSNPs.length === 0) {
        document.getElementById('q4NothingFound').style.visibility = 'visible';
    }
 }

 document.getElementById('cons-submit').onclick = (event) => {
    const formEl = document.forms['cons-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q61', 'Q62', 'Q63', 'Q64']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);
    console.log(score)
 }

 document.getElementById('hostile-submit').onclick = (event) => {
    const formEl = document.forms['hostile-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q71', 'Q72', 'Q73']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);
    console.log(score)
 }

 document.getElementById('gambling-submit').onclick = (event) => {
    const formEl = document.forms['gambling-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q81', 'Q82', 'Q83', 'Q84', 'Q85']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);
    console.log(score)
 }

 document.getElementById('pol-submit').onclick = (event) => {
    const formEl = document.forms['pol-form'];
    const formData = new FormData(formEl);
    const subQs = ['Q91', 'Q92', 'Q93', 'Q94', 'Q95']
    const score = subQs.map(q => formData.getAll(q))
                       .flat(Infinity)
                       .reduce((a, b) => parseInt(a) + parseInt(b), 0);
    console.log(score)
 }