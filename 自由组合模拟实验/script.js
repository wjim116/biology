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
 'Y_R_': 0,
 'Y_rr': 0,
 'yyR_': 0,
 'yyrr': 0
};
let femaleGamete = '';
let maleGamete = '';
let totalSimulations = 0;
const femaleGameteBtns = document.querySelectorAll('#female-gamete-btn');
const maleGameteBtns = document.querySelectorAll('#male-gamete-btn');
const fertilizationBtn = document.getElementById('fertilization-btn');
const singleSimBtn = document.getElementById('single-sim');
const sim10Btn = document.getElementById('sim-10');
const sim100Btn = document.getElementById('sim-100');
const sim1000Btn = document.getElementById('sim-1000');
const statsBtn = document.getElementById('stats-btn');
const clearBtn = document.getElementById('clear-btn');
statsBtn.textContent = '统计总数(0)';
updateTables();
const femaleYBox = document.getElementById('female-y-box');
const femaleRBox = document.getElementById('female-r-box');
const maleYBox = document.getElementById('male-y-box');
const maleRBox = document.getElementById('male-r-box');
const femaleGameteBox = document.getElementById('female-gamete');
const maleGameteBox = document.getElementById('male-gamete');
const f2ResultBox = document.getElementById('f2-result');
const phenotypeResultBox = document.getElementById('phenotype-result');
function generateRandomGene(gene1, gene2) {
 return Math.random() < 0.5 ? gene1 : gene2;
}
function formGamete(isFemaleSide) {
 const y = generateRandomGene('Y', 'y');
 const r = generateRandomGene('R', 'r');
 if (isFemaleSide) {
 femaleYBox.textContent = y;
 femaleRBox.textContent = r;
 femaleGamete = y + r;
 femaleGameteBox.textContent = femaleGamete;
 } else {
 maleYBox.textContent = y;
 maleRBox.textContent = r;
 maleGamete = y + r;
 maleGameteBox.textContent = maleGamete;
 }
}
function completeFertilization() {
 if (!femaleGamete || !maleGamete) {
 alert('请先形成两个配子!');
 return;
 }
 const femaleY = femaleGamete[0];
 const femaleR = femaleGamete[1];
 const maleY = maleGamete[0];
 const maleR = maleGamete[1];
 let yGenes = '';
 if (femaleY === maleY) {
 yGenes = femaleY + maleY;
 } else {
 yGenes = femaleY.toUpperCase() === femaleY ? femaleY + maleY : maleY + femaleY;
 }
 let rGenes = '';
 if (femaleR === maleR) {
 rGenes = femaleR + maleR;
 } else {
 rGenes = femaleR.toUpperCase() === femaleR ? femaleR + maleR : maleR + femaleR;
 }
 const genotype = yGenes + rGenes;
 f2ResultBox.textContent = genotype;
 const phenotype = determinePhenotype(genotype);
 phenotypeResultBox.textContent = phenotype;
 updateStats(genotype);
 updateTables();
}
function sortGenes(gene1, gene2) {
 if (gene1.toLowerCase() === gene2.toLowerCase()) {
 return gene1 + gene2;
 }
 return gene1 > gene2 ? gene1 + gene2 : gene2 + gene1;
}
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
function updateStats(genotype) {
 genotypeStats[genotype]++;
 totalSimulations++;
 if (genotype.includes('Y') && genotype.includes('R')) {
 phenotypeStats['Y_R_']++;
 } else if (genotype.includes('Y') && !genotype.includes('R')) {
 phenotypeStats['Y_rr']++;
 } else if (!genotype.includes('Y') && genotype.includes('R')) {
 phenotypeStats['yyR_']++;
 } else {
 phenotypeStats['yyrr']++;
 }
 statsBtn.textContent = `统计总数(${totalSimulations})`;
}
function updateTables() {
 if (totalSimulations === 0) {
 document.querySelectorAll('.stats-table .number').forEach(cell => {
 cell.textContent = '';
 });
 return;
 }
 const yyrrCount = genotypeStats['yyrr'] || 0;
 const greenWrinkledCount = phenotypeStats['yyrr'] || 0;
 document.querySelectorAll('.genotype-stats-column .stats-table tbody tr').forEach(row => {
 const genotype = row.cells[0].textContent;
 const count = genotypeStats[genotype] || 0;
 row.cells[1].textContent = count > 0 ? count : '';
 row.cells[2].textContent = (yyrrCount > 0 && count > 0) ? (count / yyrrCount).toFixed(2) : '';
 });
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
 row.cells[1].textContent = count > 0 ? count : '';
 row.cells[2].textContent = (greenWrinkledCount > 0 && count > 0) ? (count / greenWrinkledCount).toFixed(2) : '';
 }
 });
}
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
 femaleYBox.textContent = '';
 femaleRBox.textContent = '';
 maleYBox.textContent = '';
 maleRBox.textContent = '';
 document.getElementById('pea-display').innerHTML = '';
 statsBtn.textContent = '统计总数(0)';
 updateTables();
}
function multipleSimulations(times) {
 for (let i = 0; i < times; i++) {
 formGamete(true);
 formGamete(false);
 completeFertilization();
 }
}
function setupDraggable() {
 const donateBtn = document.getElementById('donate-trigger');
 let isDragging = false;
 let startX, startY;
 let initialX = 30;
 let initialY = window.innerHeight - 60;
 let dragStartTime = 0;
 function onMouseDown(e) {
 isDragging = true;
 dragStartTime = Date.now();
 const touch = e.touches ? e.touches[0] : e;
 startX = touch.clientX - donateBtn.offsetLeft;
 startY = touch.clientY - donateBtn.offsetTop;
 donateBtn.style.transition = 'none';
 donateBtn.style.cursor = 'grabbing';
 }
 function onMouseMove(e) {
 if (!isDragging) return;
 e.preventDefault();
 const touch = e.touches ? e.touches[0] : e;
 let newX = touch.clientX - startX;
 let newY = touch.clientY - startY;
 newX = Math.max(0, Math.min(window.innerWidth - donateBtn.offsetWidth, newX));
 newY = Math.max(0, Math.min(window.innerHeight - donateBtn.offsetHeight, newY));
 donateBtn.style.left = newX + 'px';
 donateBtn.style.top = newY + 'px';
 donateBtn.style.bottom = 'auto';
 }
 function onMouseUp(e) {
 if (isDragging) {
 const dragEndTime = Date.now();
 const dragDuration = dragEndTime - dragStartTime;
 if (dragDuration < 200) {
 document.getElementById('donate-panel').style.display = 'block';
 document.getElementById('overlay').style.display = 'block';
 }
 }
 isDragging = false;
 donateBtn.style.cursor = 'grab';
 donateBtn.style.transition = 'transform 0.2s';
 }
 donateBtn.style.position = 'fixed';
 donateBtn.style.left = initialX + 'px';
 donateBtn.style.top = initialY + 'px';
 donateBtn.style.bottom = 'auto';
 donateBtn.style.cursor = 'grab';
 donateBtn.addEventListener('mousedown', onMouseDown);
 document.addEventListener('mousemove', onMouseMove);
 document.addEventListener('mouseup', onMouseUp);
 donateBtn.addEventListener('touchstart', onMouseDown);
 document.addEventListener('touchmove', onMouseMove);
 document.addEventListener('touchend', onMouseUp);
}
document.addEventListener('DOMContentLoaded', function() {
 setupDraggable();
 document.getElementById('overlay').addEventListener('click', () => {
 document.getElementById('donate-panel').style.display = 'none';
 document.getElementById('overlay').style.display = 'none';
 });
 document.querySelector('.close-section').addEventListener('click', () => {
 const panel = document.getElementById('donate-panel');
 panel.querySelector('.donate-content').classList.add('panel-closing');
 setTimeout(() => {
 panel.style.display = 'none';
 document.getElementById('overlay').style.display = 'none';
 panel.querySelector('.donate-content').classList.remove('panel-closing');
 }, 500);
 });
});
document.getElementById('female-gamete-btn').addEventListener('click', () => formGamete(true));
document.getElementById('male-gamete-btn').addEventListener('click', () => formGamete(false));
fertilizationBtn.addEventListener('click', completeFertilization);
singleSimBtn.addEventListener('click', () => multipleSimulations(1));
sim10Btn.addEventListener('click', () => multipleSimulations(10));
sim100Btn.addEventListener('click', () => multipleSimulations(100));
sim1000Btn.addEventListener('click', () => multipleSimulations(1000));
clearBtn.addEventListener('click', clearAll);
jQuery.expr[':'].contains = function(a, i, m) {
 return jQuery(a).text().toUpperCase()
 .indexOf(m[3].toUpperCase()) >= 0;
};
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