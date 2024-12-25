// 定义全局变量来存储统计数据
let genotypeStats = {
    'YYRR': 0,
    'YYRr': 0,
    'YYrr': 0,
    'YyRR': 0,
    'YyRr': 0,
    'Yyrr': 0,
    'yyRR': 0,
    'yyRr': 0,
    'yyrr': 0
};

let phenotypeStats = {
    'Y_R_': 0,  // 黄圆
    'Y_rr': 0,  // 黄皱
    'yyR_': 0,  // 绿圆
    'yyrr': 0   // 绿皱
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

// 初始化表格显示（清空所有数值）
updateTables();

// ��分离盒子
const femaleYBox = document.getElementById('female-y-box');
const femaleRBox = document.getElementById('female-r-box');
const maleYBox = document.getElementById('male-y-box');
const maleRBox = document.getElementById('male-r-box');

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
    const y = generateRandomGene('Y', 'y');
    const r = generateRandomGene('R', 'r');
    
    if (isFemaleSide) {
        // 更新基因分离框显示
        femaleYBox.textContent = y;
        femaleRBox.textContent = r;
        // 配子框显示，确保Y在y左侧，R在r左侧
        femaleGamete = y + r;
        femaleGameteBox.textContent = femaleGamete;
    } else {
        // 更新基因分离框显示
        maleYBox.textContent = y;
        maleRBox.textContent = r;
        // 配子框显示，确保Y在y左侧，R在r左侧
        maleGamete = y + r;
        maleGameteBox.textContent = maleGamete;
    }
}

// 完成受精
function completeFertilization() {
    if (!femaleGamete || !maleGamete) {
        alert('请先形成两个配子！');
        return;
    }

    // 分别获取Y/y和R/r基因
    const femaleY = femaleGamete[0];  // 第一个字符是Y或y
    const femaleR = femaleGamete[1];  // 第二个字符是R或r
    const maleY = maleGamete[0];      // 第一个字符是Y或y
    const maleR = maleGamete[1];      // 第二个字符是R或r

    // 对Y/y基因进行排序（大写在前）
    let yGenes = '';
    if (femaleY === maleY) {
        // 如果两个Y基因相同
        yGenes = femaleY + maleY;
    } else {
        // 如果不同，确保大写在前
        yGenes = femaleY.toUpperCase() === femaleY ? femaleY + maleY : maleY + femaleY;
    }

    // 对R/r基因进行排序（大写在前）
    let rGenes = '';
    if (femaleR === maleR) {
        // 如果两个R基因相同
        rGenes = femaleR + maleR;
    } else {
        // 如果不同，确保大写在前
        rGenes = femaleR.toUpperCase() === femaleR ? femaleR + maleR : maleR + femaleR;
    }

    // 组合基因型，Y/y在R/r左侧
    const genotype = yGenes + rGenes;
    
    // 更新显示
    f2ResultBox.textContent = genotype;
    
    // 确定表型并显示对应图片
    const phenotype = determinePhenotype(genotype);
    phenotypeResultBox.textContent = phenotype;
    
    // 更新统计
    updateStats(genotype);
    updateTables();
}

// 对基因进行排序（大写在前）
function sortGenes(gene1, gene2) {
    // 如果两个基因相同，直接返回它们的组合
    if (gene1.toLowerCase() === gene2.toLowerCase()) {
        return gene1 + gene2;
    }
    // 如果不同，确保大写字母在前
    return gene1 > gene2 ? gene1 + gene2 : gene2 + gene1;
}

// 确定表型并显示对应图片
function determinePhenotype(genotype) {
    const peaDisplay = document.getElementById('pea-display');
    const hasY = genotype.includes('Y');
    const hasR = genotype.includes('R');
    
    if (hasY && hasR) {
        peaDisplay.innerHTML = '<img src="黄圆.png" alt="黄圆">';
        return "黄圆";
    }
    if (hasY && !hasR) {
        peaDisplay.innerHTML = '<img src="黄皱.png" alt="黄皱">';
        return "黄皱";
    }
    if (!hasY && hasR) {
        peaDisplay.innerHTML = '<img src="绿圆.png" alt="绿圆">';
        return "绿圆";
    }
    peaDisplay.innerHTML = '<img src="绿皱.png" alt="绿皱">';
    return "绿皱";
}

// 更新统计数据
function updateStats(genotype) {
    genotypeStats[genotype]++;
    totalSimulations++;
    
    // 更新表型统计
    if (genotype.includes('Y') && genotype.includes('R')) {
        phenotypeStats['Y_R_']++;
    } else if (genotype.includes('Y') && !genotype.includes('R')) {
        phenotypeStats['Y_rr']++;
    } else if (!genotype.includes('Y') && genotype.includes('R')) {
        phenotypeStats['yyR_']++;
    } else {
        phenotypeStats['yyrr']++;
    }

    // 更新统计按钮文本
    statsBtn.textContent = `统计总数(${totalSimulations})`;
}

// 更新表格显示
function updateTables() {
    if (totalSimulations === 0) {
        // 如果没有模拟数据，将所有数值单元格设为空
        document.querySelectorAll('.stats-table .number').forEach(cell => {
            cell.textContent = '';
        });
        return;
    }

    // 获取基准值
    const yyrrCount = genotypeStats['yyrr'] || 0;
    const greenWrinkledCount = phenotypeStats['yyrr'] || 0;

    // 更新基因型表格
    document.querySelectorAll('.genotype-stats-column .stats-table tbody tr').forEach(row => {
        const genotype = row.cells[0].textContent;
        const count = genotypeStats[genotype] || 0;
        // 只显示非零值
        row.cells[1].textContent = count > 0 ? count : '';
        // 计算并显示与yyrr的比值，只显示非零值
        row.cells[2].textContent = (yyrrCount > 0 && count > 0) ? (count / yyrrCount).toFixed(2) : '';
    });
    
    // 更新表型表格
    const phenotypeMap = {
        'Y_R_黄圆': 'Y_R_',
        'Y_rr黄皱': 'Y_rr',
        'yyR_绿圆': 'yyR_',
        'yyrr绿皱': 'yyrr'
    };

    document.querySelectorAll('.phenotype-stats-column .stats-table tbody tr').forEach(row => {
        const phenotypeName = row.cells[0].textContent;
        const key = phenotypeMap[phenotypeName];
        if (key) {
            const count = phenotypeStats[key] || 0;
            // 只显示非零值
            row.cells[1].textContent = count > 0 ? count : '';
            // 计算并显示与绿皱的比值，只显示非零值
            row.cells[2].textContent = (greenWrinkledCount > 0 && count > 0) ? (count / greenWrinkledCount).toFixed(2) : '';
        }
    });
}

// 清空所有数据
function clearAll() {
    // 清空统计数据
    Object.keys(genotypeStats).forEach(key => genotypeStats[key] = 0);
    Object.keys(phenotypeStats).forEach(key => phenotypeStats[key] = 0);
    totalSimulations = 0;
    
    // 清空显示
    femaleGamete = '';
    maleGamete = '';
    femaleGameteBox.textContent = '';
    maleGameteBox.textContent = '';
    f2ResultBox.textContent = '';
    phenotypeResultBox.textContent = '';
    femaleYBox.textContent = '';
    femaleRBox.textContent = '';
    maleYBox.textContent = '';
    maleRBox.textContent = '';
    
    // 清空表型图片
    document.getElementById('pea-display').innerHTML = '';
    
    // 重置统计按钮文本
    statsBtn.textContent = '统计总数(0)';
    
    // 更新表格
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

// jQuery扩展方法用于选择包含文本的元素
jQuery.expr[':'].contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
}; 

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