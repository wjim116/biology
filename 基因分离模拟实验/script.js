// 定义全局变量来存储统计数据
let genotypeStats = {
    'PP': 0,
    'Pp': 0,
    'pp': 0
};

let phenotypeStats = {
    'P_': 0,  // 紫花
    'pp': 0   // 白花
};

// 当前状态变量
let femaleGamete = '';
let maleGamete = '';
let totalSimulations = 0;

// DOM 元素
const femaleGameteBtns = document.querySelectorAll('#female-gamete-btn');
const maleGameteBtns = document.querySelectorAll('#male-gamete-btn');
const fertilizationBtn = document.getElementById('fertilization-btn');
const singleSimBtn = document.getElementById('single-sim');
const sim10Btn = document.getElementById('sim-10');
const sim100Btn = document.getElementById('sim-100');
const sim1000Btn = document.getElementById('sim-1000');
const statsBtn = document.getElementById('stats-btn');
const clearBtn = document.getElementById('clear-btn');

// 初始化统计按钮文本
statsBtn.textContent = '统计总数(0)';

// 初始化表格显示
updateTables();

// 基因分离盒子
const femalePBox = document.getElementById('female-p-box');
const malePBox = document.getElementById('male-p-box');

// 配子和结果显示框
const femaleGameteBox = document.getElementById('female-gamete');
const maleGameteBox = document.getElementById('male-gamete');
const f2ResultBox = document.getElementById('f2-result');
const phenotypeResultBox = document.getElementById('phenotype-result');

// 生成随机基因
function generateRandomGene(gene1, gene2) {
    return Math.random() < 0.5 ? gene1 : gene2;
}

// 形成配子
function formGamete(isFemaleSide) {
    const p = generateRandomGene('P', 'p');
    
    if (isFemaleSide) {
        femalePBox.textContent = p;
        femaleGamete = p;
        femaleGameteBox.textContent = femaleGamete;
    } else {
        malePBox.textContent = p;
        maleGamete = p;
        maleGameteBox.textContent = maleGamete;
    }
}

// 完成受精
function completeFertilization() {
    if (!femaleGamete || !maleGamete) {
        alert('请先形成两个配子！');
        return;
    }

    // 对基因进行排序（大写在前）
    let genotype = sortGenes(femaleGamete, maleGamete);
    
    // 更新显示
    f2ResultBox.textContent = genotype;
    
    // 确定表型并显示对应图片
    const phenotype = determinePhenotype(genotype);
    phenotypeResultBox.textContent = phenotype;
    
    // 更新统计
    updateStats(genotype);
    updateTables();
}

// 对基因进行排序（P在左，p在右）
function sortGenes(gene1, gene2) {
    // 如果两个基因相同，直接返回
    if (gene1 === gene2) {
        return gene1 + gene2;
    }
    // 如果有一个是P，一个是p，确保P在左
    if ((gene1 === 'P' && gene2 === 'p') || (gene1 === 'p' && gene2 === 'P')) {
        return 'Pp';
    }
    // 其他情况（虽然在这个实验中不会出现）
    return gene1 + gene2;
}

// 确定表型并显示对应图片
function determinePhenotype(genotype) {
    const flowerDisplay = document.getElementById('flower-display');
    
    if (genotype.includes('P')) {
        // 紫花
        flowerDisplay.innerHTML = '<img src="紫花.png" alt="紫花">';
        return "紫花";
    } else {
        // 白花
        flowerDisplay.innerHTML = '<img src="白花.png" alt="白花">';
        return "白花";
    }
}

// 更新统计数据
function updateStats(genotype) {
    // 确保基因型格式正确（P在左，p在右）
    if (genotype === 'pP') {
        genotype = 'Pp';
    }
    
    // 更新基因型统计
    genotypeStats[genotype]++;
    totalSimulations++;
    
    // 更新表型统计
    if (genotype.includes('P')) {
        phenotypeStats['P_']++;
    } else {
        phenotypeStats['pp']++;
    }

    // 更新统计按钮文本
    statsBtn.textContent = `统计总数(${totalSimulations})`;
}

// 更新表格显示
function updateTables() {
    if (totalSimulations === 0) {
        document.querySelectorAll('.stats-table .number').forEach(cell => {
            cell.textContent = '';
        });
        return;
    }

    // 获取基准值
    const ppCount = genotypeStats['pp'] || 0;
    const whiteCount = phenotypeStats['pp'] || 0;

    // 更新基因型表格
    document.querySelectorAll('.genotype-stats-column .stats-table tbody tr').forEach(row => {
        const genotype = row.cells[0].textContent;
        const count = genotypeStats[genotype] || 0;
        row.cells[1].textContent = count > 0 ? count : '';
        row.cells[2].textContent = (ppCount > 0 && count > 0) ? (count / ppCount).toFixed(2) : '';
    });
    
    // 更新表型表格
    const phenotypeMap = {
        'P_紫花': 'P_',
        'pp白花': 'pp'
    };

    document.querySelectorAll('.phenotype-stats-column .stats-table tbody tr').forEach(row => {
        const phenotypeName = row.cells[0].textContent;
        const key = phenotypeMap[phenotypeName];
        if (key) {
            const count = phenotypeStats[key] || 0;
            row.cells[1].textContent = count > 0 ? count : '';
            row.cells[2].textContent = (whiteCount > 0 && count > 0) ? (count / whiteCount).toFixed(2) : '';
        }
    });
}

// 清空所有数据
function clearAll() {
    Object.keys(genotypeStats).forEach(key => genotypeStats[key] = 0);
    Object.keys(phenotypeStats).forEach(key => phenotypeStats[key] = 0);
    totalSimulations = 0;
    
    femaleGamete = '';
    maleGamete = '';
    femaleGameteBox.textContent = '';
    maleGameteBox.textContent = '';
    f2ResultBox.textContent = '';
    phenotypeResultBox.textContent = '';
    femalePBox.textContent = '';
    malePBox.textContent = '';
    
    // 清空花朵图片
    document.getElementById('flower-display').innerHTML = '';
    
    statsBtn.textContent = '统计总数(0)';
    updateTables();
}

// 多次模拟
function multipleSimulations(times) {
    for (let i = 0; i < times; i++) {
        formGamete(true);
        formGamete(false);
        completeFertilization();
    }
}

// 绑定事件监听器
document.getElementById('female-gamete-btn').addEventListener('click', () => formGamete(true));
document.getElementById('male-gamete-btn').addEventListener('click', () => formGamete(false));
fertilizationBtn.addEventListener('click', completeFertilization);
singleSimBtn.addEventListener('click', () => multipleSimulations(1));
sim10Btn.addEventListener('click', () => multipleSimulations(10));
sim100Btn.addEventListener('click', () => multipleSimulations(100));
sim1000Btn.addEventListener('click', () => multipleSimulations(1000));
clearBtn.addEventListener('click', clearAll);

// 模态窗口控制
const modal = document.getElementById('rules-modal');
const helpBtn = document.getElementById('help-btn');
const closeBtn = document.querySelector('.close-button');

helpBtn.onclick = function() {
    modal.style.display = "block";
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 